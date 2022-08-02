import BackupIcon from "remixicon-react/UploadCloud2FillIcon"

import { Outlet, useLoaderData } from "@remix-run/react"
import {
  type ActionFunction,
  type LoaderFunction,
  json,
  redirect,
} from "@remix-run/server-runtime"

import {
  backupDatabase,
  generateBackupNameFromBackupPath,
} from "@gs/admin/backup/service.server"
import AdminLayout from "@gs/admin/layout/AdminLayout"
import { authenticateRoute } from "@gs/service/auth.server"
import Storage, { type StorageFile } from "@gs/service/storage.server"
import Action from "@gs/ui/Action"

interface LoaderData {
  list: string[]
  files: StorageFile[]
}

const pathname = "/admin/settings/backups/"

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)
  const { files } = await Storage.queryDir("backup/")
  const list = files.map((file) => generateBackupNameFromBackupPath(file.name))

  return json<LoaderData>({ list, files })
}

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request)

  if (request.method === "POST") {
    const filePath = await backupDatabase()
    return redirect(`${pathname}${filePath}`)
  }

  return null
}

export default function Backups(): JSX.Element | null {
  const { list, files } = useLoaderData<LoaderData>()

  return (
    <AdminLayout
      title={"Backups"}
      navGroups={[
        {
          id: "backups",
          label: "Backups",
          showCount: true,
          children: list.map((item) => ({
            id: item,
            to: item,
            children: item,
          })),
        },
      ]}
      actions={[
        {
          id: "backup",
          children: (
            <Action action={pathname} method="post" title="Backup database">
              <BackupIcon />
            </Action>
          ),
        },
      ]}
    >
      <Outlet context={{ files }} />
    </AdminLayout>
  )
}
