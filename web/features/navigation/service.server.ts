import {
  FeatureFlagKey,
  getAreFeaturesEnabled,
} from "@gs/service/feature-flag.server"

const navigationRemoteConfigKeys = [FeatureFlagKey.EnableSearch] as const

// Helpers

export interface NavigationRemoteConfig
  extends Record<typeof navigationRemoteConfigKeys[number], boolean> {}

export async function getNavigationRemoteConfig() {
  return getAreFeaturesEnabled(...navigationRemoteConfigKeys)
}
