import invariant from "tiny-invariant"

import {
  deleteFirebaseStorageFile,
  downloadFirebaseStorageFile,
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

export function getStoragePaths(paths: string[]): Promise<StoragePathProps[]> {
  return Promise.all(
    paths.map(async (path) => {
      const data = await getFirebaseStorageFile(path)

      if (path.endsWith("/")) {
        const dirProps: StorageDirProps = {
          type: StoragePathType.Dir,
          ...(await getFirebaseStorageFiles(path)),
          path,
          data,
        }

        return dirProps
      }

      const fileProps: StorageFileProps = {
        type: StoragePathType.File,
        path,
        data,
        blob: await downloadFirebaseStorageFile(path),
      }

      return fileProps
    }),
  )
}

export async function modifyStorage(method: string, form: FormData) {
  if (method === "DELETE") {
    const path = form.get("path")?.toString()
    invariant(path, "Asset path is required.")

    createAdminLogger("Storage").info(`Deleting asset ${path}`)
    return await deleteFirebaseStorageFile(path)
  }

  if (method === "POST") {
    const file = form.get("filePath") as File
    invariant(file, "File path is required.")

    const destination = form.get("destination")?.toString() || ""

    createAdminLogger("Storage").info(`Creating asset ${destination}`)

    // return await uploadFirebaseStorageFile(filePath, { destination })
    return await uploadFirebaseStorageFile(file.name, file)
  }
}
