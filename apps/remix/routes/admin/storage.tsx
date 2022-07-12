import { RefreshIcon, UploadIcon } from "@gs/icons"
import { useLoaderData } from "@remix-run/react"
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"

import AdminAppRegistry, { AdminAppId } from "~/features/admin"
import { createAdminMeta } from "~/features/admin/helpers"
import AdminLayout from "~/features/admin/layout/AdminLayout"
import { generateNavbarGroupsFromStorageDirContents } from "~/features/admin/storage/helpers"
import { modifyStorage } from "~/features/admin/storage/service.server"
import type { AdminAppHandle } from "~/features/admin/types"
import type { NavigationLinkProps } from "~/features/navigation/types"
import { authenticateRoute } from "~/features/service/auth.server"
import storage, { type StorageDir } from "~/features/service/storage.server"
import Action from "~/features/ui/Action"
import { ErrorSection } from "~/features/ui/Error"
import Popover from "~/features/ui/Popover"
import PopoverUpload from "~/features/ui/Popover/Upload"
import { Caption } from "~/features/ui/Text"

const adminApp = AdminAppRegistry.get(AdminAppId.Storage)

interface LoaderData extends StorageDir {}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)
  const { dirs, files } = await storage.queryDir()

  return json<LoaderData>({ dirs, files })
}

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request)
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
        <Action.Form title="Refresh">
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
      header={<Caption>{adminApp.name}</Caption>}
    />
  )
}

export const meta: MetaFunction = () => createAdminMeta(adminApp.name)

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection title={`Problem with ${adminApp.name}.`} error={error} />
}

export const handle: AdminAppHandle = { adminApp }
