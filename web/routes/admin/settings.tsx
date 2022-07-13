import { AdminAppId, adminRegistry } from "@gs/admin"
import { createAdminMeta } from "@gs/admin/helpers"
import AdminLayout from "@gs/admin/layout/AdminLayout"
import { type AdminNavbarGroupProps } from "@gs/admin/layout/AdminNavbar"
import type { AdminAppHandle } from "@gs/admin/types"
import { authenticateRoute } from "@gs/service/auth.server"
import { ErrorSection } from "@gs/ui/Error"
import { Caption } from "@gs/ui/Text"
import type {
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/server-runtime"

const adminApp = adminRegistry.getApp(AdminAppId.Settings)

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)

  return null
}

export default function SettingsAdminApp(): JSX.Element | null {
  const navGroups: AdminNavbarGroupProps[] = [
    {
      id: "settings",
      label: "Settings",
      children: [
        {
          id: "feature-flags",
          to: "feature-flags",
          children: "Feature flags",
        },
        {
          id: "backups",
          to: "backups",
          children: "Backups",
        },
      ],
    },
  ]

  return (
    <AdminLayout
      {...adminApp}
      header={<Caption>{adminApp.title}</Caption>}
      navGroups={navGroups}
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
