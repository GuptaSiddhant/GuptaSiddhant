import invariant from "tiny-invariant"

import {
  deleteFirebaseStorageDir,
  deleteFirebaseStorageFile,
  getFirebaseStorageFile,
  getFirebaseStorageFiles,
  renameFirebaseStorageFile,
  uploadFirebaseStorageFile,
} from "~/features/service/storage.server"

import { createAdminLogger } from "../service.server"
import { generatePathsFromPath } from "./helpers"
import {
  type StorageDirProps,
  type StorageFileProps,
  type StoragePathProps,
  StoragePathType,
} from "./types"

const storageLogger = createAdminLogger("Storage")

export async function getStoragePaths(
  paths: string[],
): Promise<StoragePathProps[]> {
  const res = await Promise.allSettled(
    paths.map(async (path) => {
      if (path.endsWith("/")) {
        const dirProps: StorageDirProps = {
          type: StoragePathType.Dir,
          ...(await getFirebaseStorageFiles(path)),
          path,
        }

        return dirProps
      }

      const fileProps: StorageFileProps = {
        type: StoragePathType.File,
        path,
        data: await getFirebaseStorageFile(path),
      }

      return fileProps
    }),
  )

  return res
    .filter((res) => res.status === "fulfilled")
    .map((res) => (res as any).value)
}

export async function modifyStorage(
  method: string,
  form: FormData,
): Promise<string | undefined> {
  if (method === "DELETE") {
    const type = form.get("type")?.toString()

    if (type === "dir") {
      const prefix = form.get("prefix")?.toString()
      invariant(prefix, "Dir prefix is required.")

      storageLogger.info(`Deleting dir "${prefix}".`)
      await deleteFirebaseStorageDir(prefix)

      return generateRedirectUrl(generatePathsFromPath(prefix).at(-2))
    }

    const path = form.get("path")?.toString()
    invariant(path, "Asset path is required.")

    storageLogger.info(`Deleting asset "${path}".`)
    await deleteFirebaseStorageFile(path)

    return generateRedirectUrl(generatePathsFromPath(path).at(-2))
  }

  if (method === "POST") {
    const files = form.getAll("files") as File[]
    invariant(files, "File path is required.")

    const destination = form.get("destination")?.toString()

    storageLogger.info(`Creating asset "${destination}".`)
    const uploadedFiles = await Promise.all(
      files.map((file) => {
        const path = destination ? `${destination}/${file.name}` : file.name
        return uploadFirebaseStorageFile(path, file)
      }),
    )

    return uploadedFiles.length > 0
      ? generateRedirectUrl(uploadedFiles[0].linkUrl)
      : undefined
  }

  if (method === "PATCH") {
    const previousName = form.get("previousName")?.toString()
    invariant(previousName, "Asset previousName is required.")
    const name = form.get("name")?.toString()
    invariant(name, "Asset new name is required.")

    storageLogger.info(`Renaming asset "${previousName}" to "${name}".`)
    await renameFirebaseStorageFile(previousName, name)

    return generateRedirectUrl(name)
  }

  return
}

function generateRedirectUrl(path?: string) {
  const basePath = "/admin/storage"
  if (!path) return `${basePath}/`
  if (path.startsWith("/")) return `${basePath}${path}`
  return `${basePath}/${path}`
}
