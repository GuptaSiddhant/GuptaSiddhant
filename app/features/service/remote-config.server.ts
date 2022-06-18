import {
  type RemoteConfigTemplate,
  getRemoteConfig,
} from "firebase-admin/remote-config"

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

// Returns true unless explicitly disabled
export async function getIsFeatureEnabled(
  key: RemoteConfigKey,
): Promise<boolean> {
  const config = await getRemoteConfigTemplate()
  if (!config) return true

  const { parameters } = config
  if (!parameters.hasOwnProperty(key)) return true

  const { defaultValue, valueType } = parameters[key]

  if (!defaultValue || !("value" in defaultValue)) return true

  if (valueType === "BOOLEAN") return defaultValue.value !== "false"
  if (valueType === "JSON") {
    try {
      const json: { prod?: boolean; dev?: boolean } = JSON.parse(
        defaultValue.value,
      )
      if (__IS_DEV__) return json?.dev !== false
      return json?.prod !== false
    } catch {
      return true
    }
  }

  return true
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

export async function getAllRemoteConfigFeatures(): Promise<RemoteConfigBooleanMap | null> {
  const template = await getRemoteConfigTemplate()
  if (!template) return null

  return getAreFeaturesEnabled(
    ...(Object.keys(template.parameters) as RemoteConfigKey[]),
  )
}

export async function getAllRemoteConfigKeys(): Promise<RemoteConfigKey[]> {
  const template = await getRemoteConfigTemplate()
  if (!template) return []

  return Object.keys(template.parameters) as RemoteConfigKey[]
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
