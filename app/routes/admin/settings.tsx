import { Outlet, useLoaderData } from "@remix-run/react"
import type { ActionFunction } from "@remix-run/server-runtime"
import { type LoaderFunction, json, redirect } from "@remix-run/server-runtime"
import SettingsIcon from "remixicon-react/Settings3FillIcon"

import type { AdminAppProps } from "~/features/admin"
import { createAdminMeta } from "~/features/admin"
import AdminLayout from "~/features/admin/AdminLayout"
import { type AdminNavbarGroupProps } from "~/features/admin/AdminNavbar"
import { CacheType, modifyCache } from "~/features/service/cache.server"
import { getAllRemoteConfigKeys } from "~/features/service/remote-config.server"
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

export const loader: LoaderFunction = async () => {
  const featureConfigKeys = await getAllRemoteConfigKeys()

  return json<LoaderData>({ featureConfigKeys })
}

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url)
  const form = await request.formData()
  const pathname = form.get("currentPathname")?.toString() || url.pathname

  if (request.method === "PUT") {
    await modifyCache(request.method, CacheType.RemoteConfig)
  }

  return redirect(pathname)
}

export default function SettingsAdminApp(): JSX.Element | null {
  const { featureConfigKeys } = useLoaderData<LoaderData>()

  const navGroups: AdminNavbarGroupProps[] = [
    {
      id: "feature-flags",
      label: "Feature flags",
      children: [
        {
          id: "feature-flags",
          to: "feature-flags",
          children: "Feature flags",
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
  return (
    <ErrorSection
      title={`Problem with ${adminApp.name}.`}
      message={error.message}
    />
  )
}

export const handle = { adminApp }

export function meta() {
  return createAdminMeta(adminApp.name)
}

export interface AdminSettingsOutletContext {
  featureConfigKeys: string[]
}
