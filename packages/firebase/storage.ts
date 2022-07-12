import {
  type File as FirebaseStorageFile,
  type FileOptions,
} from "@google-cloud/storage"
import { getStorage } from "firebase-admin/storage"
import fs from "fs/promises"
import os from "os"
import { join } from "path"
import invariant from "tiny-invariant"

const ONE_DAY_IN_MS = 60 * 60 * 24 * 1000
const delimiter = "/"

export { FirebaseStorageFile }

export async function queryFirebaseStorageMetaData() {
  const data = (await getFirebaseStorageBucket().getMetadata())?.[0]

  return {
    id: String(data.id),
    link: String(data.selfLink),
    name: String(data.name),
    location: String(data.location),
    updateTimestamp: String(data.updated),
  }
}

export async function queryFirebaseStorageFileExists(
  path: string,
): Promise<boolean> {
  return (await getFirebaseStorageFileRef(path).exists())?.[0]
}

export async function queryFirebaseStorageFileSignedUrl(name: string) {
  if (name.startsWith(delimiter) || name.startsWith("http")) return name

  try {
    const fileResponse = await getFirebaseStorageFileRef(name).getSignedUrl({
      expires: new Date(Date.now() + ONE_DAY_IN_MS),
      action: "read",
    })

    return fileResponse.toString()
  } catch {
    return name
  }
}

export async function queryFirebaseStorageFile(filePath: string) {
  return getFirebaseStorageFileRef(filePath)
    .get()
    .then((res) => res[0])
}

/** Query the contents (files and sub-dir) in a storage path */
export async function queryFirebaseStorageDirContents(
  dirPath?: string,
): Promise<{
  dirs: string[]
  files: FirebaseStorageFile[]
}> {
  const [_files, , apiResponse] = await getFirebaseStorageBucket().getFiles({
    delimiter,
    autoPaginate: false,
    prefix: dirPath,
  })

  const dirs = apiResponse.prefixes || []
  const files = _files.filter((file) => !file.name.endsWith(delimiter))
  // console.log({ _files, dirs })

  return { dirs, files }
}

// Mutations

export async function mutateFirebaseStorageDir(
  dirPath?: string,
  files: (File | string)[] = [],
) {
  if (files.length === 0) {
    invariant(dirPath, "dirPath is required. Cannot delete all is root.")
    getFirebaseStorageBucket().deleteFiles({ prefix: dirPath })
  }

  return Promise.all(
    files.map((file) => {
      const name = typeof file === "string" ? file : file.name

      return mutateFirebaseStorageFile(
        dirPath ? join(dirPath, name) : name,
        file,
      )
    }),
  )
}

export async function mutateFirebaseStorageFile(
  filePath: string,
  file?: File | string,
): Promise<FirebaseStorageFile | boolean> {
  const fileRef = getFirebaseStorageFileRef(filePath)

  if (!file) return fileRef.delete().then((res) => Boolean(res[0]))

  if (typeof file === "string")
    return fileRef.rename(file).then((res) => res[0])

  return uploadFileInFirebaseStorage(filePath, file)
}

// Helpers

function getFirebaseStorageBucket() {
  return getStorage().bucket()
}

function getFirebaseStorageFileRef(name: string, options?: FileOptions) {
  return getFirebaseStorageBucket().file(name, options)
}

export async function uploadFileInFirebaseStorage(path: string, file: File) {
  const tempFilePath = join(os.tmpdir(), `${Math.random()}-${file.name}`)

  const data = new Uint8Array(await file.arrayBuffer())
  await fs.writeFile(tempFilePath, data)

  const response = await getStorage().bucket().upload(tempFilePath, {
    destination: path,
    resumable: true,
  })

  await fs.unlink(tempFilePath)

  return response[0]
}

export async function downloadFileFromFirebaseStorage(
  name: string,
): Promise<File> {
  const res = await getFirebaseStorageFileRef(name).download()
  return new File(res, name)
}
