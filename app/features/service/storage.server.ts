import { getStorage } from "firebase-admin/storage"
import fs from "fs/promises"
import os from "os"
import invariant from "tiny-invariant"

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

export async function resolveFirebaseStorageAssetUrl(path?: string) {
  invariant(path, "asset path is required")
  const assetExts = ["png", "jpg", "jpeg", "gif", "pdf"]

  if (
    assetExts.some((ext) => path.endsWith(ext)) &&
    (await checkFirebaseStorageFileExists(path))
  ) {
    const url = await getFirebaseStorageFileUrl(path)
    invariant(url, "could not get url for asset: '" + path + "'")

    return url
  }

  throw new Error("Not an asset: '" + path + "'")
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

export async function getBucket() {
  return getStorage().bucket()
}

export type FirebaseStorageMetaData = Awaited<
  ReturnType<typeof getFirebaseStorageMetaData>
>
export async function getFirebaseStorageMetaData() {
  const data = (await getStorage().bucket().getMetadata())?.[0]

  return {
    id: String(data.id),
    link: String(data.selfLink),
    name: String(data.name),
    location: String(data.location),
    updateTimestamp: String(data.updated),
  }
}

export async function getFirebaseStorageFiles(path?: string): Promise<{
  files: FirebaseStorageFile[]
  dirs: string[]
}> {
  const [_files, , apiResponse] = await getStorage()
    .bucket()
    .getFiles({ delimiter: "/", autoPaginate: false, prefix: path })

  const dirs = apiResponse.prefixes || []

  const files: FirebaseStorageFile[] =
    _files
      .map((file) => transformGoogleFileToFirebaseStorageFile(file))
      .filter((file) => !file.name.endsWith("/")) || []

  return { dirs, files }
}

export async function getFirebaseStorageFile(
  path: string,
): Promise<FirebaseStorageFile> {
  const [file] = await getStorage().bucket().file(path).get()
  const url = await fetchFirebaseStorageFileUrl(path)
  return transformGoogleFileToFirebaseStorageFile(file, url)
}

export type FirebaseStorageFile = {
  id: string
  name: string
  // selfLink: string
  // mediaLink: string
  contentType: string
  size: number
  createTimestamp: string
  updateTimestamp: string
  linkUrl: string
}

function transformGoogleFileToFirebaseStorageFile(
  file: any,
  url?: string,
): FirebaseStorageFile {
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

// Setters

export async function deleteFirebaseStorageFile(path: string) {
  return getStorage().bucket().file(path).delete()
}

export async function deleteFirebaseStorageDir(prefix: string) {
  return getStorage().bucket().deleteFiles({ prefix })
}

export async function uploadFirebaseStorageFile(path: string, file: File) {
  const tempDir = os.tmpdir()
  const tempFilePath = `${tempDir}/${Math.random()}-${file.name}`

  const data = new Uint8Array(await file.arrayBuffer())
  await fs.writeFile(tempFilePath, data)

  const response = await getStorage().bucket().upload(tempFilePath, {
    destination: path,
    resumable: true,
  })

  await fs.unlink(tempFilePath)

  return transformGoogleFileToFirebaseStorageFile(response[0])
}

export async function downloadFirebaseStorageFile(path: string) {
  const response = await getStorage().bucket().file(path).download()

  return transformGoogleFileToFirebaseStorageFile(response[0])
}

export async function renameFirebaseStorageFile(
  previousName: string,
  name: string,
) {
  const response = await getStorage().bucket().file(previousName).rename(name)

  return transformGoogleFileToFirebaseStorageFile(response[0])
}
