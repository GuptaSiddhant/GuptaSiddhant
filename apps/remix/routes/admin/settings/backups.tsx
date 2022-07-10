import { Outlet, useLoaderData } from "@remix-run/react"
import {
  type ActionFunction,
  type LoaderFunction,
  json,
  redirect,
} from "@remix-run/server-runtime"
import BackupIcon from "remixicon-react/UploadCloud2FillIcon"

import {
  backupDatabase,
  generateBackupNameFromBackupPath,
} from "~/features/admin/backup/service.server"
import AdminLayout from "~/features/admin/layout/AdminLayout"
import { authenticateRoute } from "~/features/service/auth.server"
import storage, { type StorageFile } from "~/features/service/storage.server"
import FormAction from "~/features/ui/FormAction"

interface LoaderData {
  list: string[]
  files: StorageFile[]
}

const pathname = "/admin/settings/backups/"

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)
  const { files } = await storage.queryDir("backup/")
  const list = files.map((file) => generateBackupNameFromBackupPath(file.name))

  return json<LoaderData>({ list, files })
}

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request)
  console.log({ action: request.url, name: "parent", method: request.method })

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
      name={"Backups"}
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
            <FormAction action={pathname} method="post" title="Backup database">
              <BackupIcon />
            </FormAction>
          ),
        },
      ]}
    >
      <Outlet context={{ files }} />
    </AdminLayout>
  )
}
