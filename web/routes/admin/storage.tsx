import { useLoaderData } from "@remix-run/react"
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"

import { AdminAppId, adminRegistry } from "@gs/admin"
import { createAdminMeta } from "@gs/admin/helpers"
import AdminLayout from "@gs/admin/layout/AdminLayout"
import { generateNavbarGroupsFromStorageDirContents } from "@gs/admin/storage/helpers"
import { modifyStorage } from "@gs/admin/storage/service.server"
import type { AdminAppHandle } from "@gs/admin/types"
import { RefreshIcon, UploadIcon } from "@gs/icons"
import { UserRole } from "@gs/models/users"
import type { NavigationLinkProps } from "@gs/navigation/types"
import { authenticateRoute } from "@gs/service/auth.server"
import Storage, { type StorageDir } from "@gs/service/storage.server"
import Action from "@gs/ui/Action"
import { ErrorSection } from "@gs/ui/Error"
import Popover from "@gs/ui/Popover"
import PopoverUpload from "@gs/ui/Popover/Upload"
import { Caption } from "@gs/ui/Text"

const adminApp = adminRegistry.getApp(AdminAppId.Storage)

interface LoaderData extends StorageDir {}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)
  const { dirs, files } = await Storage.queryDir()

  return json<LoaderData>({ dirs, files })
}

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request, UserRole.EDITOR)
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
        <Action.Form method="get" title="Refresh">
          <RefreshIcon />
        </Action.Form>
      ),
    },
  ]

  return (
    <AdminLayout
      {...adminApp}
      className="!overflow-y-hidden overflow-x-scroll"
      actions={actions}
      navGroups={generateNavbarGroupsFromStorageDirContents(dirs, files)}
      header={<Caption>{adminApp.title}</Caption>}
    />
  )
}

export const meta: MetaFunction = () => createAdminMeta(adminApp.title)

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorSection title={`Problem with ${adminApp.title}.`} error={error} />
  )
}

export const handle: AdminAppHandle = { adminApp }
