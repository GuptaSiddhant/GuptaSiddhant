import {
  mutateFirebaseRemoteConfigMap,
  queryFirebaseRemoteConfigKeys,
  queryFirebaseRemoteConfigTemplate,
  queryFirebaseRemoteConfigValueAndTypeByKey,
} from "@gs/firebase/remote-config";

import { deleteCachedKey, fetchCachedKey } from "./cache.server";

export enum FeatureFlagKey {}

const cacheKey = "feature-flags";

// Getters

export interface FeatureFlagJson {
  dev: boolean;
  prod: boolean;
}

export type FeatureFlagsMap<T extends FeatureFlagKey = FeatureFlagKey> = Record<
  T,
  FeatureFlagJson
>;

export async function getAllFeatureFlags(): Promise<FeatureFlagsMap | null> {
  return fetchCachedKey(cacheKey, async () => {
    const template = await queryFirebaseRemoteConfigTemplate();
    const keys = await queryFirebaseRemoteConfigKeys(template);
    const keysTypeValueList = await Promise.all(
      keys.map((key) =>
        queryFirebaseRemoteConfigValueAndTypeByKey(template, key),
      ),
    );

    return keysTypeValueList.reduce((acc, item) => {
      if (!item) {
        return acc;
      }

      const { key, type, value } = item;
      switch (type) {
        case "BOOLEAN": {
          const boolValue = value === "true";
          return { ...acc, [key]: { dev: boolValue, prod: boolValue } };
        }
        case "JSON": {
          const jsonValue = JSON.parse(value);
          if (
            jsonValue &&
            typeof jsonValue === "object" &&
            "dev" in jsonValue &&
            "prod" in jsonValue
          ) {
            return { ...acc, [key]: jsonValue };
          }
        }
        default:
          return acc;
      }
    }, {} as FeatureFlagsMap);
  });
}

// Returns true unless explicitly disabled
export async function getIsFeatureEnabled(
  key: FeatureFlagKey,
): Promise<boolean> {
  return getAreFeaturesEnabled(key).then((map) => map[key]);
}

export type RemoteConfigBooleanMap<T extends FeatureFlagKey = FeatureFlagKey> =
  Record<T, boolean>;

export async function getAreFeaturesEnabled<T extends FeatureFlagKey>(
  ...keys: T[]
): Promise<RemoteConfigBooleanMap<T>> {
  const featureFlagsMap = await getAllFeatureFlags();
  if (!featureFlagsMap) {
    const remoteConfigBooleanMap = {} as RemoteConfigBooleanMap<T>;
    keys.forEach((key) => {
      remoteConfigBooleanMap[key] = true;
    });

    return remoteConfigBooleanMap;
  }

  return keys.reduce((acc, key) => {
    const featureFlag = featureFlagsMap[key];
    const value = featureFlag
      ? __IS_DEV__
        ? featureFlag.dev
        : featureFlag.prod
      : true;

    return { ...acc, [key]: value };
  }, {} as RemoteConfigBooleanMap<T>);
}

// Setters

export async function setFeatureFlag(
  flag: string,
  value: boolean | FeatureFlagJson,
) {
  await mutateFirebaseRemoteConfigMap({ [flag]: value });
  invalidateFeatureFlagsCache();
}

export async function deleteFeatureFlag(flag: string) {
  await mutateFirebaseRemoteConfigMap({ [flag]: undefined });
  invalidateFeatureFlagsCache();
}

// misc

export function invalidateFeatureFlagsCache() {
  deleteCachedKey(cacheKey);
}
