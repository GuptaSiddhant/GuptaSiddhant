import { queryFirebaseRemoteConfigKeys } from "@gs/firebase/remote-config"
import { Outlet, useLoaderData } from "@remix-run/react"
import { type LoaderFunction, json } from "@remix-run/server-runtime"
import SettingsIcon from "remixicon-react/Settings3FillIcon"

import type { AdminAppProps } from "~/features/admin"
import { createAdminMeta } from "~/features/admin"
import AdminLayout from "~/features/admin/layout/AdminLayout"
import { type AdminNavbarGroupProps } from "~/features/admin/layout/AdminNavbar"
import { authenticateRoute } from "~/features/service/auth.server"
import { ErrorSection } from "~/features/ui/Error"
import { Caption } from "~/features/ui/Text"

const adminApp: AdminAppProps = {
  id: "settings",
  name: "Settings",
  icon: <SettingsIcon />,
  to: "/admin/settings",
}

interface LoaderData {
  featureConfigKeys: string[]
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)
  const featureConfigKeys = await queryFirebaseRemoteConfigKeys()

  return json<LoaderData>({ featureConfigKeys })
}

export default function SettingsAdminApp(): JSX.Element | null {
  const { featureConfigKeys } = useLoaderData<LoaderData>()

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
      header={<Caption>{adminApp.name}</Caption>}
      navGroups={navGroups}
    >
      <Outlet context={{ featureConfigKeys }} />
    </AdminLayout>
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
