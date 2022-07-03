import { useLoaderData } from "@remix-run/react"
import { type LoaderFunction, json } from "@remix-run/server-runtime"
import StorageIcon from "remixicon-react/HardDrive2FillIcon"

import type { AdminAppProps } from "~/features/admin"
import { createAdminMeta } from "~/features/admin"
import AdminLayout from "~/features/admin/AdminLayout"
import { generateNavbarGroupsFromFirebaseStorageDirsFiles } from "~/features/admin/storage/helpers"
import {
  type FirebaseStorageFile,
  getFirebaseStorageFiles,
} from "~/features/service/storage.server"
import { ErrorSection } from "~/features/ui/Error"
import { Caption } from "~/features/ui/Text"

const adminApp: AdminAppProps = {
  id: "storage",
  name: "Storage",
  icon: <StorageIcon />,
  to: "/admin/storage",
}

interface LoaderData {
  dirs: string[]
  files: FirebaseStorageFile[]
}

export const loader: LoaderFunction = async () => {
  const { dirs, files } = await getFirebaseStorageFiles()

  return json<LoaderData>({ dirs, files })
}

export default function StorageAdminApp(): JSX.Element | null {
  const { dirs, files } = useLoaderData<LoaderData>()

  return (
    <AdminLayout
      {...adminApp}
      navGroups={generateNavbarGroupsFromFirebaseStorageDirsFiles(dirs, files)}
      header={<Caption>{adminApp.name}</Caption>}
    />
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title={`Problem with ${adminApp.name}.`} error={error} />
}

export const handle = { adminApp }

export function meta() {
  return createAdminMeta(adminApp.name)
}

export interface AdminSettingsOutletContext {
  featureConfigKeys: string[]
}
