import invariant from "tiny-invariant"

import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"

import { AdminAppId, adminRegistry } from "@gs/admin"
import { generateBackupPathFromBackupName } from "@gs/admin/backup/service.server"
import AdminLayout from "@gs/admin/layout/AdminLayout"
import { DeleteIcon } from "@gs/icons"
import useRootContext from "@gs/root/RootContext"
import { authenticateRoute } from "@gs/service/auth.server"
import type { StorageFile } from "@gs/service/storage.server"
import storage from "@gs/service/storage.server"
import Action from "@gs/ui/Action"
import CodeBlock from "@gs/ui/CodeBlock"
import { getDeleteConfirmProps } from "@gs/ui/Popover/Confirm"
import { formatDateTime } from "@gs/utils/format"

const adminApp = adminRegistry.getApp(AdminAppId.Settings)

interface LoaderData {
  name: string
  path: string
  asset: StorageFile
  data: string
}

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request)
  const name = params["name"]
  invariant(name, "Filename is required")

  const path = generateBackupPathFromBackupName(name)

  try {
    const asset = await storage.queryAsset(path)
    const file = await storage.downloadAsset(path)
    const data = JSON.stringify(JSON.parse(await file.text()), null, 2)

    return json<LoaderData>({ asset, name, path, data })
  } catch {
    return redirect(adminApp.linkPath + "backups")
  }
}

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request)

  const form = await request.formData()
  const originPath = form.get("originPath")?.toString() || "/"

  if (request.method === "DELETE") {
    const path = form.get("path")?.toString()
    invariant(path, "Asset path is required.")
    await storage.mutateAsset(path)

    return redirect(adminApp.linkPath + "backups")
  }

  return redirect(originPath)
}

export default function StoragePath(): JSX.Element | null {
  const { name, path, data, asset } = useLoaderData<LoaderData>()
  const { locale } = useRootContext()

  return (
    <AdminLayout
      title={name}
      className="p-4"
      footer={
        <div className="flex justify-between text-base text-disabled">
          Backup on{" "}
          {formatDateTime(new Date(asset.updateTimestamp), { locale })}
        </div>
      }
      actions={[
        {
          id: "Delete",
          children: (
            <Action
              method="delete"
              body={{ path }}
              title="Delete backup"
              confirm={getDeleteConfirmProps("backup")}
              toast="Deleting backup..."
            >
              <DeleteIcon />
            </Action>
          ),
        },
      ]}
    >
      <CodeBlock lang="json" wrap className="!m-0">
        {data}
      </CodeBlock>
    </AdminLayout>
  )
}
