import { getStorage } from "firebase-admin/storage"
import cache, { createCacheKey, CacheType } from "./cache.server"

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
        expires: new Date(Date.now() + 86400000),
        action: "read",
      })

    return fileResponse.toString()
  } catch {
    return name
  }
}