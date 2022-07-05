import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import { generatePathsFromPath } from "~/features/admin/storage/helpers"
import {
  getStoragePaths,
  modifyStorage,
} from "~/features/admin/storage/service.server"
import StorageDirView from "~/features/admin/storage/StorageDirView"
import { type StoragePathProps } from "~/features/admin/storage/types"

import { handle } from "../storage"

interface LoaderData {
  storagePaths: StoragePathProps[]
}

export const loader: LoaderFunction = async ({ params }) => {
  const path = params["*"]
  if (!path) return redirect(handle.adminApp.to.toString())

  const paths = generatePathsFromPath(path)
  try {
    const storagePaths = await getStoragePaths(paths)

    return json<LoaderData>({ storagePaths })
  } catch {
    const redirectPath =
      paths.length >= 2 ? "/" + paths[paths.length - 2] : undefined

    const redirectRootPath = handle.adminApp.to.toString()
    return redirect(redirectRootPath + (redirectPath || ""))
  }
}

export const action: ActionFunction = async ({ request }) => {
  const { method } = request
  const form = await request.formData()
  const origin = form.get("origin")?.toString() || "/"

  await modifyStorage(method, form)

  return redirect(origin)
}

export default function StoragePath(): JSX.Element | null {
  const { storagePaths } = useLoaderData<LoaderData>()

  return <StorageDirView storagePaths={storagePaths} />
}