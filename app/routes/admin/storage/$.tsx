import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import StorageView, {
  type StoragePathProps,
  StoragePathType,
} from "~/features/admin/storage/StorageView"
import { getFirebaseStorageFiles } from "~/features/service/storage.server"

interface LoaderData {
  storagePaths: StoragePathProps[]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const path = params["*"]
  if (!path) return redirect("..")

  const paths = path
    .split("/")
    .filter(Boolean)
    .map((_, index, parts) => parts.slice(0, index + 1).join("/"))
    .map((path) =>
      path.match(/.*\.(\w*)$/) || path.endsWith("/") ? path : `${path}/`,
    )

  const storagePaths = await Promise.all(
    paths.map(async (path) =>
      path.endsWith("/")
        ? {
            type: StoragePathType.Dir,
            path,
            ...(await getFirebaseStorageFiles(path)),
          }
        : {
            type: StoragePathType.File,
            path,
            files: [],
            dirs: [],
          },
    ),
  )

  return json<LoaderData>({ storagePaths })
}

export default function StoragePath(): JSX.Element | null {
  const { storagePaths } = useLoaderData<LoaderData>()

  return <StorageView storagePaths={storagePaths} />
}
