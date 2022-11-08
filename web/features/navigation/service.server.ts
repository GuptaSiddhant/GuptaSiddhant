import {
  type FeatureFlagKey,
  getAreFeaturesEnabled,
} from "@gs/service/feature-flag.server";

const navigationRemoteConfigKeys: Readonly<FeatureFlagKey[]> = [] as const;

// Helpers

export interface NavigationRemoteConfig
  extends Record<typeof navigationRemoteConfigKeys[number], boolean> {}

export async function getNavigationRemoteConfig() {
  if (navigationRemoteConfigKeys.length === 0) {
    return {};
  }
  return getAreFeaturesEnabled(...navigationRemoteConfigKeys);
}
