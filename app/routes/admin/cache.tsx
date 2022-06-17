import { useLoaderData, useSubmit } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import CacheIcon from "remixicon-react/Database2FillIcon"
import ClearIcon from "remixicon-react/DeleteBin2FillIcon"
import RefreshIcon from "remixicon-react/RefreshFillIcon"

import type { AdminAppProps } from "~/features/admin"
import { createAdminMeta } from "~/features/admin"
import AdminLayout from "~/features/admin/AdminLayout"
import { type AdminNavbarGroupProps } from "~/features/admin/AdminNavbar"
import cache, {
  type ModifyCacheMethod,
  modifyCache,
  parseCacheKey,
} from "~/features/service/cache.server"
import { ErrorSection } from "~/features/ui/Error"
import type { NavigationLinkProps } from "~/features/ui/Link"
import { Caption } from "~/features/ui/Text"

const adminApp: AdminAppProps = {
  id: "cache",
  name: "Cache",
  icon: <CacheIcon />,
}

interface LoaderData {
  navGroups: AdminNavbarGroupProps[]
  pathname: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const { pathname } = new URL(request.url)
  const keys = [...cache.keys()].sort()
  const navGroups = createNavGroupsFromKeys(keys)

  return json<LoaderData>({ navGroups, pathname })
}

export const action: ActionFunction = async ({ request }) => {
  const { pathname } = new URL(request.url)
  await modifyCache(request.method as ModifyCacheMethod)

  return redirect(pathname)
}

export default function CacheUI(): JSX.Element | null {
  const submit = useSubmit()
  const { navGroups, pathname } = useLoaderData<LoaderData>()

  const actions: NavigationLinkProps[] = [
    {
      id: "Refresh",
      onClick: () =>
        submit({}, { action: pathname, method: "get", replace: true }),
      children: <RefreshIcon aria-label="Refresh" />,
    },
    {
      id: "Clear all",
      onClick: () =>
        submit({}, { action: pathname, method: "delete", replace: true }),
      children: <ClearIcon aria-label="Clear" />,
    },
  ]

  return (
    <AdminLayout
      {...adminApp}
      header={<Caption>{adminApp.name}</Caption>}
      actions={actions}
      navGroups={navGroups}
    />
  )
}

function createNavGroupsFromKeys(keys: string[]): AdminNavbarGroupProps[] {
  const groupMap: Record<string, NavigationLinkProps[]> = {}

  keys.forEach((key) => {
    const { type, value } = parseCacheKey(key) || {}
    if (type) {
      groupMap[type] = groupMap[type] || []
      groupMap[type].push({
        id: key,
        to: key,
        children: value || type,
      })
    }
  })

  return Object.keys(groupMap).map((type) => ({
    id: type,
    label: type.toUpperCase().replace(/-/g, " "),
    children: groupMap[type],
  }))
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Problem with CacheUI" message={error.message} />
}

export const handle = {
  adminApp,
}

export function meta() {
  return createAdminMeta(adminApp.name)
}
