import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import StorageView from "~/features/admin/storage/StorageView"
import {
  type StorageDirProps,
  type StorageFileProps,
  type StoragePathProps,
  StoragePathType,
} from "~/features/admin/storage/types"
import {
  getFirebaseStorageFile,
  getFirebaseStorageFiles,
} from "~/features/service/storage.server"

import { handle } from "../storage"

interface LoaderData {
  storagePaths: StoragePathProps[]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const path = params["*"]
  if (!path) return redirect(handle.adminApp.to.toString())

  const paths = path
    .split("/")
    .filter(Boolean)
    .map((_, index, parts) => parts.slice(0, index + 1).join("/"))
    .map((path) =>
      path.match(/.*\.(\w*)$/) || path.endsWith("/") ? path : `${path}/`,
    )

  const storagePaths: StoragePathProps[] = await Promise.all(
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

  return json<LoaderData>({ storagePaths })
}

export default function StoragePath(): JSX.Element | null {
  const { storagePaths } = useLoaderData<LoaderData>()

  return <StorageView storagePaths={storagePaths} />
}
