import invariant from "tiny-invariant"

import {
  deleteFirebaseStorageFile,
  getFirebaseStorageFile,
  getFirebaseStorageFiles,
  uploadFirebaseStorageFile,
} from "~/features/service/storage.server"

import { createAdminLogger } from "../service.server"
import {
  type StorageDirProps,
  type StorageFileProps,
  type StoragePathProps,
  StoragePathType,
} from "./types"

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

  return res.filter((res) => res.status === "fulfilled").map((res) => res.value)
}

export async function modifyStorage(method: string, form: FormData) {
  if (method === "DELETE") {
    const path = form.get("path")?.toString()
    invariant(path, "Asset path is required.")

    createAdminLogger("Storage").info(`Deleting asset ${path}`)
    return await deleteFirebaseStorageFile(path)
  }

  if (method === "POST") {
    const files = form.getAll("files") as File[]
    invariant(files, "File path is required.")

    const destination = form.get("destination")?.toString()

    createAdminLogger("Storage").info(`Creating asset ${destination}`)

    return Promise.all(
      files.map((file) => {
        const path = destination ? `${destination}/${file.name}` : file.name
        return uploadFirebaseStorageFile(path, file)
      }),
    )
  }
}
