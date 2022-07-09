import {
  type FirebaseStorageFile,
  downloadFileFromFirebaseStorage,
  mutateFirebaseStorageDir,
  mutateFirebaseStorageFile,
  queryFirebaseStorageDirContents,
  queryFirebaseStorageFile,
  queryFirebaseStorageFileExists,
  queryFirebaseStorageFileSignedUrl,
  queryFirebaseStorageMetaData,
} from "@gs/firebase/storage"
import invariant from "tiny-invariant"

import {
  deleteCachedKey,
  deleteCachedKeysWith,
  fetchCachedKey,
} from "./cache.server"

const cacheKey = "storage"

export type StorageDir = {
  dirs: string[]
  files: StorageFile[]
}
export type StorageFile = {
  id: string
  name: string
  contentType: string
  size: number
  createTimestamp: string
  updateTimestamp: string
  linkUrl: string
}
export type StorageMetadata = Awaited<ReturnType<typeof storage.queryMetadata>>

export class Storage {
  #createCacheKey = (path: string) => [cacheKey, path].filter(Boolean).join("/")

  queryMetadata = async () => queryFirebaseStorageMetaData()

  invalidateCacheByPath = (path: string) =>
    deleteCachedKey(this.#createCacheKey(path))

  invalidateCacheAll = (path?: string) =>
    deleteCachedKeysWith(path ? this.#createCacheKey(path) : cacheKey)

  // Queries

  queryAssetExists = async (path: string): Promise<boolean> =>
    queryFirebaseStorageFileExists(path)

  queryAssetPublicUrl = async (path: string): Promise<string> =>
    fetchCachedKey(this.#createCacheKey(path), () =>
      queryFirebaseStorageFileSignedUrl(path),
    )

  queryAsset = async (path: string): Promise<StorageFile> => {
    const file = await queryFirebaseStorageFile(path)
    const publicUrl = await this.queryAssetPublicUrl(path)

    return transformFromFirebaseStorageFile(file, publicUrl)
  }

  downloadAsset = (path: string): Promise<File> =>
    downloadFileFromFirebaseStorage(path)

  queryDir = async (path?: string): Promise<StorageDir> =>
    queryFirebaseStorageDirContents(path).then((contents) => ({
      ...contents,
      files: contents.files.map((file) =>
        transformFromFirebaseStorageFile(file, path),
      ),
    }))
  // Mutations

  mutateAsset = async (filePath: string, file?: string | File) =>
    mutateFirebaseStorageFile(filePath, file).then((res) => {
      this.invalidateCacheByPath(filePath)
      if (typeof res === "boolean") return res
      return transformFromFirebaseStorageFile(res, filePath)
    })

  mutateDir = async (dirPath?: string, files?: Array<string | File>) =>
    mutateFirebaseStorageDir(dirPath, files).then((resList) => {
      this.invalidateCacheAll(dirPath)
      return resList.map((res) => {
        if (typeof res === "boolean") return res
        return transformFromFirebaseStorageFile(res)
      })
    })
}

const storage = new Storage()
export default storage

// Helpers

function transformFromFirebaseStorageFile(
  file: FirebaseStorageFile,
  url?: string,
): StorageFile {
  return {
    id: file.id || file.metadata.id,
    name: file.metadata.name,
    contentType: file.metadata.contentType,
    size: Number.parseInt(file.metadata.size, 10),
    createTimestamp: file.metadata.timeCreated,
    updateTimestamp: file.metadata.updated,
    linkUrl: url || `/${file.metadata.name}`,
  }
}

export async function resolveStorageAssetUrl(path?: string) {
  invariant(path, "asset path is required")
  const assetExts = ["png", "jpg", "jpeg", "gif", "pdf"]

  if (
    assetExts.some((ext) => path.endsWith(ext)) &&
    (await storage.queryAssetExists(path))
  ) {
    const url = await storage.queryAssetPublicUrl(path)
    invariant(url, "could not get url for asset: '" + path + "'")

    return url
  }

  throw new Error("Not an asset: '" + path + "'")
}
