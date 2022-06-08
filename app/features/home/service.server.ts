import {
  FirestoreCollection,
  getFirestoreDocument,
} from "~/packages/service/firestore.server"
import {
  getAreFeaturesEnabled,
  RemoteConfigKey,
} from "~/packages/service/remote-config.server"

import type { About } from "."

export async function getAboutInfo() {
  const about = await getFirestoreDocument<About>(
    FirestoreCollection.Info,
    "about",
  )

  if (!about) throw new Error("No about info found")

  return about
}

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
