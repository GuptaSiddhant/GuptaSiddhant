import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import CacheIcon from "remixicon-react/Database2FillIcon"
import ClearIcon from "remixicon-react/DeleteBin2FillIcon"
import RefreshIcon from "remixicon-react/RefreshFillIcon"

import type { AdminAppProps } from "~/features/admin"
import { createAdminMeta } from "~/features/admin"
import AdminLayout from "~/features/admin/layout/AdminLayout"
import { type AdminNavbarGroupProps } from "~/features/admin/layout/AdminNavbar"
import type { NavigationLinkProps } from "~/features/navigation/types"
import { authenticateRoute } from "~/features/service/auth.server"
import {
  type ModifyCacheMethod,
  getCache,
  modifyCache,
  parseCacheKey,
} from "~/features/service/cache.server"
import useTransitionSubmissionToast from "~/features/toaster/useTransitionSubmissionToast"
import Action from "~/features/ui/Action"
import { ErrorSection } from "~/features/ui/Error"
import { Caption } from "~/features/ui/Text"

const adminApp: AdminAppProps = {
  id: "cache",
  name: "Cache",
  icon: <CacheIcon />,
  to: "/admin/cache",
}

interface LoaderData {
  keys: string[]
  pathname: string
  groupMap: Record<string, NavigationLinkProps[]>
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)

  const { pathname } = new URL(request.url)
  const keys = [...getCache().keys()].sort()
  const groupMap = createGroupMapFromKeys(keys)

  return json<LoaderData>({ keys, pathname, groupMap })
}

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request)

  const { pathname } = new URL(request.url)
  const form = await request.formData()
  const key = form.get("key")?.toString()
  const origin = form.get("origin")?.toString()

  await modifyCache(request.method as ModifyCacheMethod, key)

  return redirect(origin || pathname)
}

export default function CacheAdminApp(): JSX.Element | null {
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
        <Action title="Refresh cache" method="get" toast="Refreshing cache...">
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
        >
          <ClearIcon />
        </Action>
      ),
    },
  ]

  useTransitionSubmissionToast({
    GET: `Refreshing cache`,
    DELETE: `Clearing cache`,
  })

  return (
    <AdminLayout
      {...adminApp}
      header={<Caption>{adminApp.name}</Caption>}
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

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title={`Problem with ${adminApp.name}.`} error={error} />
}

export const handle = { adminApp }

export function meta() {
  return createAdminMeta(adminApp.name)
}
