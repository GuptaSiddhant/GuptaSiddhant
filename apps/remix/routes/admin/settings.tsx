import type {
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/server-runtime"

import { AdminAppId, adminRegistry } from "~/features/admin"
import { createAdminMeta } from "~/features/admin/helpers"
import AdminLayout from "~/features/admin/layout/AdminLayout"
import { type AdminNavbarGroupProps } from "~/features/admin/layout/AdminNavbar"
import type { AdminAppHandle } from "~/features/admin/types"
import { authenticateRoute } from "~/features/service/auth.server"
import { ErrorSection } from "~/features/ui/Error"
import { Caption } from "~/features/ui/Text"

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
