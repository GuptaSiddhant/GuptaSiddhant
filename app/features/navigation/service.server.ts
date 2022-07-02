import {
  getAreFeaturesEnabled,
  RemoteConfigKey,
} from "~/features/service/feature-flag.server"

const navigationRemoteConfigKeys = [RemoteConfigKey.EnableSearch] as const

// Helpers

export interface NavigationRemoteConfig
  extends Record<typeof navigationRemoteConfigKeys[number], boolean> {}

export async function getNavigationRemoteConfig() {
  return getAreFeaturesEnabled(...navigationRemoteConfigKeys)
}
