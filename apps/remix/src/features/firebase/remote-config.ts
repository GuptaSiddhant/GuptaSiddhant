import {
  type ParameterValueType,
  type RemoteConfigTemplate,
  getRemoteConfig,
} from "firebase-admin/remote-config";

import invariant from "@gs/utils/invariant";

export type FirebaseRemoteConfigTemplate = RemoteConfigTemplate;

/** Query the Firebase remote-config's template. */
export async function queryFirebaseRemoteConfigTemplate(): Promise<FirebaseRemoteConfigTemplate> {
  return getRemoteConfig().getTemplate();
}

/** Mutate the Firebase remote-config's template. */
export async function mutateFirebaseRemoteConfigTemplate(
  template: FirebaseRemoteConfigTemplate,
): Promise<FirebaseRemoteConfigTemplate> {
  try {
    await getRemoteConfig().validateTemplate(template);
    return await getRemoteConfig().publishTemplate(template);
  } catch (error) {
    throw new Error(`Could not mutate the remote-config: ${error}`);
  }
}

/** Query all the keys currently available in the Firebase remote-config. */
export async function queryFirebaseRemoteConfigKeys(
  template: FirebaseRemoteConfigTemplate,
): Promise<string[]> {
  if (!template) {
    return [];
  }

  return Object.keys(template.parameters).filter((key) => {
    const defaultValue = template.parameters[key].defaultValue;

    if (!defaultValue) {
      return false;
    }
    if (!("value" in defaultValue)) {
      return false;
    }
    return Boolean(defaultValue.value);
  });
}

/** Query the value (and it's type) of a Firebase remote-config key. */
export async function queryFirebaseRemoteConfigValueAndTypeByKey(
  template: FirebaseRemoteConfigTemplate,
  key: string,
): Promise<FirebaseRemoteConfigKeyTypeValue | undefined> {
  if (!template) {
    return undefined;
  }

  const parameter = template.parameters[key];
  if (!parameter) {
    return undefined;
  }

  const { defaultValue, valueType } = parameter;
  if (!(defaultValue && "value" in defaultValue && valueType)) {
    return undefined;
  }

  return { type: valueType, value: defaultValue.value, key };
}

/** Query Firebase remote-config as an object */
export async function queryFirebaseRemoteConfigMap(
  template: FirebaseRemoteConfigTemplate,
) {
  const keys = await queryFirebaseRemoteConfigKeys(template);
  const keysTypeValueList = await Promise.all(
    keys.map((key) =>
      queryFirebaseRemoteConfigValueAndTypeByKey(template, key),
    ),
  );

  return keysTypeValueList.reduce(
    (acc, item) =>
      item
        ? { ...acc, [item.key]: parseFirebaseRemoteConfigKeyTypeValue(item) }
        : acc,
    {} as FirebaseRemoteConfigMap,
  );
}

/** Mutate Firebase remote-config with a partial object */
export async function mutateFirebaseRemoteConfigMap(
  configMap: FirebaseRemoteConfigMap,
) {
  const template = await queryFirebaseRemoteConfigTemplate();
  invariant(template, "Could not get the remote-config template");

  Object.entries(configMap).forEach(([key, value]) => {
    if (value === undefined) {
      // rome-ignore lint/performance/noDelete: Need to delete
      return delete template.parameters[key];
    }

    template.parameters[key] = {
      ...(template.parameters[key] || {}),
      valueType:
        typeof value === "string"
          ? "STRING"
          : typeof value === "number"
          ? "NUMBER"
          : typeof value === "boolean"
          ? "BOOLEAN"
          : "JSON",
      defaultValue: {
        value: JSON.stringify(value),
      },
    };
  });

  return mutateFirebaseRemoteConfigTemplate(template);
}

export interface FirebaseRemoteConfigKeyTypeValue {
  type: ParameterValueType;
  value: string;
  key: string;
}

export type FirebaseRemoteConfigMap = Record<
  string,
  string | number | boolean | object | undefined
>;

export function parseFirebaseRemoteConfigKeyTypeValue({
  type,
  value,
}: Partial<FirebaseRemoteConfigKeyTypeValue>) {
  if (!value) {
    return undefined;
  }

  switch (type) {
    case "BOOLEAN":
      return value === "true";
    case "NUMBER":
      return Number.parseFloat(value);
    case "JSON":
      return JSON.parse(value);
    case "STRING":
    default:
      return value;
  }
}
