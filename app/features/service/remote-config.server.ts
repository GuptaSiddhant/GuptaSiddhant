import {
  type RemoteConfigTemplate,
  getRemoteConfig,
} from "firebase-admin/remote-config"
import invariant from "tiny-invariant"

import cache, { CacheType, createCacheKey } from "./cache.server"

// Getters

export async function getRemoteConfigTemplate() {
  return cache.fetch<RemoteConfigTemplate>(
    createCacheKey(CacheType.RemoteConfig),
    {
      ttl: 1000 * 60 * 60, // 1 hour
      allowStale: false,
    },
  )
}

export interface FeatureFlagJson {
  dev: boolean
  prod: boolean
}

export type FeatureFlagsMap<T extends RemoteConfigKey = RemoteConfigKey> =
  Record<T, FeatureFlagJson>

export async function getAllFeatureFlags(): Promise<FeatureFlagsMap | null> {
  const { parameters } = (await getRemoteConfigTemplate()) || {}
  if (!parameters) return null

  const keys = Object.keys(parameters) as RemoteConfigKey[]

  return keys.reduce((acc, key) => {
    if (!parameters.hasOwnProperty(key)) return acc

    const { defaultValue, valueType } = parameters[key]
    if (!defaultValue || !("value" in defaultValue)) return acc

    if (valueType === "BOOLEAN") {
      const value = defaultValue.value === "true"
      return { ...acc, [key]: { dev: value, prod: value } }
    }

    if (valueType === "JSON") {
      try {
        const json: { prod: boolean; dev: boolean } = JSON.parse(
          defaultValue.value,
        )
        return { ...acc, [key]: json }
      } catch {
        return acc
      }
    }

    return acc
  }, {} as FeatureFlagsMap)
}

// Returns true unless explicitly disabled
export async function getIsFeatureEnabled(
  key: RemoteConfigKey,
): Promise<boolean> {
  const featureFlagsMap = await getAllFeatureFlags()
  if (!featureFlagsMap) return true

  const featureFlag = featureFlagsMap[key]
  if (!featureFlag) return true

  return __IS_DEV__ ? featureFlag.dev : featureFlag.prod
}

export type RemoteConfigBooleanMap<
  T extends RemoteConfigKey = RemoteConfigKey,
> = Record<T, boolean>

export async function getAreFeaturesEnabled<T extends RemoteConfigKey>(
  ...keys: T[]
): Promise<RemoteConfigBooleanMap<T>> {
  const enabledList = await Promise.all(keys.map(getIsFeatureEnabled))

  return keys.reduce(
    (acc, key, index) => ({ ...acc, [key]: enabledList[index] }),
    {} as RemoteConfigBooleanMap<T>,
  )
}

export async function getAllRemoteConfigKeys(): Promise<RemoteConfigKey[]> {
  const template = await getRemoteConfigTemplate()
  if (!template) return []

  return (Object.keys(template.parameters) as RemoteConfigKey[]).filter(
    (key) => {
      const defaultValue = template.parameters[key].defaultValue
      if (!defaultValue) return false
      if (!("value" in defaultValue)) return false
      return Boolean(defaultValue.value)
    },
  )
}

// Setters

export async function setFeatureFlag(
  flag: string,
  value: boolean | FeatureFlagJson,
) {
  const template = await fetchRemoteConfig()
  invariant(template, "Could not get the remote-config template")

  template.parameters[flag] = {
    ...(template.parameters[flag] || {}),
    valueType: "JSON",
    defaultValue: {
      value: JSON.stringify(
        typeof value === "boolean" ? { prod: value, dev: value } : value,
      ),
    },
  }

  return await setRemoteConfigTemplate(template)
}

export async function deleteFeatureFlag(
  flag: string,
): Promise<RemoteConfigTemplate> {
  const template = await fetchRemoteConfig()
  invariant(template, "Could not get the remote-config template")

  delete template.parameters[flag]
  return await setRemoteConfigTemplate(template)
}

async function setRemoteConfigTemplate(
  template: RemoteConfigTemplate,
): Promise<RemoteConfigTemplate> {
  try {
    const config = getRemoteConfig()
    await config.validateTemplate(template)
    return await config.publishTemplate(template)
  } catch (error) {
    throw new Error(`Could not set the remote-config: ${error}`)
  }
}

// Fetchers

export async function fetchRemoteConfig() {
  return getRemoteConfig().getTemplate()
}

// Keys

export enum RemoteConfigKey {
  About = "enableAbout",
  Search = "enableSearch",
  AdminNavCollapsed = "toggleAdminNavbarCollapsed",
  DefaultPauseCachePolling = "defaultPauseCachePolling",
}

// Exports

export { RemoteConfigTemplate }
