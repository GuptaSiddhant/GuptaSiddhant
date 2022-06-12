import { getStorage } from "firebase-admin/storage"

import { ONE_DAY_IN_MS } from "../constants"
import cache, { CacheType, createCacheKey } from "./cache.server"

// Getters

export async function getFirebaseStorageFileUrl(path: string) {
  return cache.fetch<string>(
    createCacheKey(CacheType.FirebaseStorageFileUrl, path),
  )
}

// Fetchers

export async function fetchFirebaseStorageFileUrl(name: string) {
  if (name.startsWith("/") || name.startsWith("http")) return name

  try {
    const fileResponse = await getStorage()
      .bucket()
      .file(name)
      .getSignedUrl({
        expires: new Date(Date.now() + ONE_DAY_IN_MS),
        action: "read",
      })

    return fileResponse.toString()
  } catch {
    return name
  }
}
