import {
  getAreFeaturesEnabled,
  RemoteConfigKey,
} from "~/features/service/remote-config.server"

const navigationRemoteConfigKeys = [RemoteConfigKey.Search] as const

// Helpers

export interface NavigationRemoteConfig
  extends Record<typeof navigationRemoteConfigKeys[number], boolean> {}

export async function getNavigationRemoteConfig() {
  return getAreFeaturesEnabled(...navigationRemoteConfigKeys)
}
