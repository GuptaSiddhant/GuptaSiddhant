import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import AdminAppRegistry, { AdminAppId } from "~/features/admin"
import { generatePathsFromPath } from "~/features/admin/storage/helpers"
import {
  getStoragePaths,
  modifyStorage,
} from "~/features/admin/storage/service.server"
import StorageDirView from "~/features/admin/storage/StorageDirView"
import { type StoragePathProps } from "~/features/admin/storage/types"
import { authenticateRoute } from "~/features/service/auth.server"

interface LoaderData {
  storagePaths: StoragePathProps[]
}

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request)
  const path = params["*"]
  const adminApp = AdminAppRegistry.get(AdminAppId.Storage)

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

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request)
  const { method } = request
  const form = await request.formData()
  const origin = form.get("origin")?.toString() || "/"

  const redirectTo = await modifyStorage(method, form)

  return redirect(redirectTo || origin)
}

export default function StoragePath(): JSX.Element | null {
  const { storagePaths } = useLoaderData<LoaderData>()

  return <StorageDirView storagePaths={storagePaths} />
}
