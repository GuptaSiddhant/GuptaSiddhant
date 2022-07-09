import { RefreshIcon, UploadIcon } from "@gs/icons"
import { useLoaderData } from "@remix-run/react"
import {
  type ActionFunction,
  type LoaderFunction,
  json,
  redirect,
} from "@remix-run/server-runtime"
import StorageIcon from "remixicon-react/HardDrive2FillIcon"

import type { AdminAppProps } from "~/features/admin"
import { createAdminMeta } from "~/features/admin"
import AdminLayout from "~/features/admin/layout/AdminLayout"
import { generateNavbarGroupsFromStorageDirContents } from "~/features/admin/storage/helpers"
import { modifyStorage } from "~/features/admin/storage/service.server"
import type { NavigationLinkProps } from "~/features/navigation/types"
import storage, { type StorageFile } from "~/features/service/storage.server"
import { ErrorSection } from "~/features/ui/Error"
import FormAction from "~/features/ui/FormAction"
import Popover from "~/features/ui/Popover"
import PopoverUpload from "~/features/ui/Popover/Upload"
import { Caption } from "~/features/ui/Text"

const adminApp: AdminAppProps = {
  id: "storage",
  name: "Storage",
  icon: <StorageIcon />,
  to: "/admin/storage",
}

interface LoaderData {
  dirs: string[]
  files: StorageFile[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const { dirs, files } = await storage.queryDir()

  return json<LoaderData>({ dirs, files })
}

export const action: ActionFunction = async ({ request }) => {
  const { method } = request
  const form = await request.formData()

  const redirectTo = await modifyStorage(method, form)

  return redirect(redirectTo || new URL(request.url).pathname)
}

export default function StorageAdminApp(): JSX.Element | null {
  const { dirs, files } = useLoaderData<LoaderData>()
  const actions: NavigationLinkProps[] = [
    {
      id: "upload",
      children: (
        <Popover title="Upload" content={<PopoverUpload />}>
          <UploadIcon />
        </Popover>
      ),
    },
    {
      id: "refresh",
      children: (
        <FormAction method="get" title="Refresh">
          <RefreshIcon />
        </FormAction>
      ),
    },
  ]

  return (
    <AdminLayout
      {...adminApp}
      className="!overflow-y-hidden overflow-x-scroll"
      actions={actions}
      navGroups={generateNavbarGroupsFromStorageDirContents(dirs, files)}
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
