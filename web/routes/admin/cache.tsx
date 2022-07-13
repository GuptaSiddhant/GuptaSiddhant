import { AdminAppId, adminRegistry } from "@gs/admin"
import { createAdminMeta, useAdminApp } from "@gs/admin/helpers"
import AdminLayout from "@gs/admin/layout/AdminLayout"
import { type AdminNavbarGroupProps } from "@gs/admin/layout/AdminNavbar"
import type { AdminAppHandle } from "@gs/admin/types"
import type { NavigationLinkProps } from "@gs/navigation/types"
import { authenticateRoute } from "@gs/service/auth.server"
import {
  type ModifyCacheMethod,
  getCache,
  modifyCache,
  parseCacheKey,
} from "@gs/service/cache.server"
import Action from "@gs/ui/Action"
import { ErrorSection } from "@gs/ui/Error"
import { Caption } from "@gs/ui/Text"
import { useLoaderData } from "@remix-run/react"
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"
import ClearIcon from "remixicon-react/DeleteBin2FillIcon"
import RefreshIcon from "remixicon-react/RefreshFillIcon"

const adminApp = adminRegistry.getApp(AdminAppId.Cache)

interface LoaderData {
  groupMap: Record<string, NavigationLinkProps[]>
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)

  const keys = [...getCache().keys()].sort()
  const groupMap = createGroupMapFromKeys(keys)

  return json<LoaderData>({ groupMap })
}

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request)
  const { pathname } = new URL(request.url)

  await modifyCache(request.method as ModifyCacheMethod)

  return redirect(pathname)
}

export default function CacheAdminApp(): JSX.Element | null {
  const adminApp = useAdminApp()
  const { groupMap } = useLoaderData<LoaderData>()

  const navGroups: AdminNavbarGroupProps[] = Object.keys(groupMap).map(
    (type) => ({
      id: type,
      label: type.toUpperCase().replace(/-/g, " "),
      showCount: true,
      children: groupMap[type],
    }),
  )

  const actions: NavigationLinkProps[] = [
    {
      id: "Refresh",
      children: (
        <Action
          title="Refresh cache"
          method="patch"
          toast="Refreshing cache..."
          action={adminApp.linkPath}
        >
          <RefreshIcon />
        </Action>
      ),
    },
    {
      id: "Clear",
      children: (
        <Action
          title="Clear cache"
          method="delete"
          confirm="Are you sure about clearing cache?"
          toast="Clearing cache..."
          action={adminApp.linkPath}
        >
          <ClearIcon />
        </Action>
      ),
    },
  ]

  return (
    <AdminLayout
      {...adminApp}
      header={<Caption>{adminApp.title}</Caption>}
      actions={actions}
      navGroups={navGroups}
    />
  )
}

function createGroupMapFromKeys(keys: string[]) {
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

  return groupMap
}

export const meta: MetaFunction = () => createAdminMeta(adminApp.title)

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorSection title={`Problem with ${adminApp.title}.`} error={error} />
  )
}

export const handle: AdminAppHandle = { adminApp }
