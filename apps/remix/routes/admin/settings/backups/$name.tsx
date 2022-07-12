import { DeleteIcon } from "@gs/icons"
import { formatDateTime } from "@gs/utils/format"
import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"

import AdminAppRegistry, { AdminAppId } from "~/features/admin"
import { generateBackupPathFromBackupName } from "~/features/admin/backup/service.server"
import AdminLayout from "~/features/admin/layout/AdminLayout"
import { authenticateRoute } from "~/features/service/auth.server"
import type { StorageFile } from "~/features/service/storage.server"
import storage from "~/features/service/storage.server"
import Action from "~/features/ui/Action"
import CodeBlock from "~/features/ui/CodeBlock"
import { getDeleteConfirmProps } from "~/features/ui/Popover/Confirm"

const adminApp = AdminAppRegistry.get(AdminAppId.Settings)

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
    return redirect(adminApp.to + "backups")
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

    return redirect(adminApp.to + "backups")
  }

  return redirect(originPath)
}

export default function StoragePath(): JSX.Element | null {
  const { name, path, data, asset } = useLoaderData<LoaderData>()

  return (
    <AdminLayout
      name={name}
      className="p-4"
      footer={
        <div className="flex justify-between text-base text-disabled">
          Backup on {formatDateTime(new Date(asset.updateTimestamp))}
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
