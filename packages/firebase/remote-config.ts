import {
  type ParameterValueType,
  type RemoteConfig,
  type RemoteConfigTemplate,
  getRemoteConfig,
} from "firebase-admin/remote-config"
import invariant from "tiny-invariant"

export type FirebaseRemoteConfigTemplate = RemoteConfigTemplate

export class FirebaseRemoteConfig {
  static #remoteConfig: RemoteConfig = getRemoteConfig()

  /** Query the Firebase remote-config's template. */
  static queryTemplate = async (): Promise<FirebaseRemoteConfigTemplate> =>
    this.#remoteConfig.getTemplate()

  /** Mutate the Firebase remote-config's template. */
  static mutateTemplate = async (
    template: FirebaseRemoteConfigTemplate,
  ): Promise<FirebaseRemoteConfigTemplate> => {
    try {
      await this.#remoteConfig.validateTemplate(template)
      return await this.#remoteConfig.publishTemplate(template)
    } catch (error) {
      throw new Error(`Could not mutate the remote-config: ${error}`)
    }
  }

  /** Query all the keys currently available in the Firebase remote-config. */
  static queryKeys = async (): Promise<string[]> => {
    const template = await this.queryTemplate()
    if (!template) return []

    return Object.keys(template.parameters).filter((key) => {
      const defaultValue = template.parameters[key].defaultValue

      if (!defaultValue) return false
      if (!("value" in defaultValue)) return false
      return Boolean(defaultValue.value)
    })
  }

  /** Query the value (and it's type) of a Firebase remote-config key. */
  static queryValueAndTypeByKey = async (
    key: string,
  ): Promise<FirebaseRemoteConfigKeyTypeValue | undefined> => {
    const template = await this.queryTemplate()
    if (!template) return undefined

    const parameter = template.parameters[key]
    if (!parameter) return undefined

    const { defaultValue, valueType } = parameter
    if (!defaultValue || !("value" in defaultValue) || !valueType)
      return undefined

    return { type: valueType, value: defaultValue.value, key }
  }

  /** Query Firebase remote-config as an object */
  static queryMap = async () => {
    const keys = await this.queryKeys()
    const keysTypeValueList = await Promise.all(
      keys.map(this.queryValueAndTypeByKey),
    )

    return keysTypeValueList.reduce(
      (acc, item) =>
        item
          ? { ...acc, [item.key]: parseFirebaseRemoteConfigKeyTypeValue(item) }
          : acc,
      {} as FirebaseRemoteConfigMap,
    )
  }

  /** Mutate Firebase remote-config with a partial object */
  static mutateMap = async (configMap: FirebaseRemoteConfigMap) => {
    const template = await this.queryTemplate()
    invariant(template, "Could not get the remote-config template")

    Object.entries(configMap).forEach(([key, value]) => {
      if (value === undefined) {
        return delete template.parameters[key]
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
      }
    })

    return this.mutateTemplate(template)
  }
}

export default FirebaseRemoteConfig

export interface FirebaseRemoteConfigKeyTypeValue {
  type: ParameterValueType
  value: string
  key: string
}

export type FirebaseRemoteConfigMap = Record<
  string,
  string | number | boolean | object | undefined
>

export function parseFirebaseRemoteConfigKeyTypeValue({
  type,
  value,
}: Partial<FirebaseRemoteConfigKeyTypeValue>) {
  if (!value) return undefined
  switch (type) {
    case "BOOLEAN":
      return value === "true"
    case "NUMBER":
      return Number.parseFloat(value)
    case "JSON":
      return JSON.parse(value)
    case "STRING":
    default:
      return value
  }
}
