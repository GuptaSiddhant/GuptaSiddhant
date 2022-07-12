import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import { AdminAppRegistry, AdminAppId } from "~/features/admin"
import { generatePathsFromPath } from "~/features/admin/storage/helpers"
import { getStoragePaths } from "~/features/admin/storage/service.server"
import StorageDirView from "~/features/admin/storage/StorageDirView"
import { type StoragePathProps } from "~/features/admin/storage/types"
import { authenticateRoute } from "~/features/service/auth.server"

const adminApp = AdminAppRegistry.get(AdminAppId.Storage)

interface LoaderData {
  storagePaths: StoragePathProps[]
}

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request)
  const path = params["*"]

  if (!path) return redirect(adminApp.to)

  const paths = generatePathsFromPath(path)
  try {
    const storagePaths = await getStoragePaths(paths)

    return json<LoaderData>({ storagePaths })
  } catch {
    const redirectRootPath = adminApp.to
    const redirectPath =
      paths.length >= 2 ? "/" + paths[paths.length - 2] : undefined

    return redirect(redirectRootPath + (redirectPath || ""))
  }
}

export default function StoragePath(): JSX.Element | null {
  const { storagePaths } = useLoaderData<LoaderData>()

  return <StorageDirView storagePaths={storagePaths} />
}
