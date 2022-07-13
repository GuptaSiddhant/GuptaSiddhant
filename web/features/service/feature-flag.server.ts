import {
  type FirebaseRemoteConfigTemplate,
  mutateFirebaseRemoteConfigMap,
  queryFirebaseRemoteConfigKeys,
  queryFirebaseRemoteConfigValueAndTypeByKey,
} from "@gs/firebase/remote-config"

export enum FeatureFlagKey {
  EnableSearch = "enableSearch",
}

// Getters

export interface FeatureFlagJson {
  dev: boolean
  prod: boolean
}

export type FeatureFlagsMap<T extends FeatureFlagKey = FeatureFlagKey> = Record<
  T,
  FeatureFlagJson
>

export async function getAllFeatureFlags(): Promise<FeatureFlagsMap | null> {
  const keys = await queryFirebaseRemoteConfigKeys()
  const keysTypeValueList = await Promise.all(
    keys.map(queryFirebaseRemoteConfigValueAndTypeByKey),
  )

  return keysTypeValueList.reduce((acc, item) => {
    if (!item) return acc
    const { key, type, value } = item
    switch (type) {
      case "BOOLEAN": {
        const boolValue = value === "true"
        return { ...acc, [key]: { dev: boolValue, prod: boolValue } }
      }
      case "JSON": {
        const jsonValue = JSON.parse(value)
        if ("dev" in jsonValue && "prod" in jsonValue) {
          return { ...acc, [key]: jsonValue }
        }
      }
      default:
        return acc
    }
  }, {} as FeatureFlagsMap)
}

// Returns true unless explicitly disabled
export async function getIsFeatureEnabled(
  key: FeatureFlagKey,
): Promise<boolean> {
  const featureFlagsMap = await getAllFeatureFlags()
  if (!featureFlagsMap) return true

  const featureFlag = featureFlagsMap[key]
  if (!featureFlag) return true

  return __IS_DEV__ ? featureFlag.dev : featureFlag.prod
}

export type RemoteConfigBooleanMap<T extends FeatureFlagKey = FeatureFlagKey> =
  Record<T, boolean>

export async function getAreFeaturesEnabled<T extends FeatureFlagKey>(
  ...keys: T[]
): Promise<RemoteConfigBooleanMap<T>> {
  const enabledList = await Promise.all(keys.map(getIsFeatureEnabled))

  return keys.reduce(
    (acc, key, index) => ({ ...acc, [key]: enabledList[index] }),
    {} as RemoteConfigBooleanMap<T>,
  )
}

// Setters

export async function setFeatureFlag(
  flag: string,
  value: boolean | FeatureFlagJson,
) {
  return await mutateFirebaseRemoteConfigMap({ [flag]: value })
}

export async function deleteFeatureFlag(
  flag: string,
): Promise<FirebaseRemoteConfigTemplate> {
  return await mutateFirebaseRemoteConfigMap({ [flag]: undefined })
}
