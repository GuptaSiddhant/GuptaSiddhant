import {
  getAreFeaturesEnabled,
  RemoteConfigKey,
} from "~/packages/service/remote-config.server"

const navigationRemoteConfigKeys = [
  RemoteConfigKey.About,
  RemoteConfigKey.Search,
] as const

// Helpers

export interface NavigationRemoteConfig
  extends Record<typeof navigationRemoteConfigKeys[number], boolean> {}

export async function getNavigationRemoteConfig() {
  return getAreFeaturesEnabled(...navigationRemoteConfigKeys)
}
