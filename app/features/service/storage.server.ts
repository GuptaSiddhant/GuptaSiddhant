import { getStorage } from "firebase-admin/storage"

import { ONE_DAY_IN_MS } from "~/features/constants"

import { CacheType, createCacheKey, fetchCachedKey } from "./cache.server"

// Getters

export async function getFirebaseStorageFileUrl(path: string): Promise<string> {
  const key = createCacheKey(CacheType.FirebaseStorageFileUrl, path)

  return fetchCachedKey(key, () => fetchFirebaseStorageFileUrl(path))
}

export async function checkFirebaseStorageFileExists(
  path: string,
): Promise<boolean> {
  return (await getStorage().bucket().file(path).exists())?.[0]
}

// Fetchers

async function fetchFirebaseStorageFileUrl(name: string) {
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
