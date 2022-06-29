import { useLoaderData } from "@remix-run/react"
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
import useTransitionSubmissionToast from "~/features/toaster/useTransitionSubmissionToast"
import { ErrorSection } from "~/features/ui/Error"
import FormAction from "~/features/ui/FormAction"
import type { NavigationLinkProps } from "~/features/ui/Link"
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
  const { pathname } = new URL(request.url)
  const keys = [...cache.keys()].sort()
  const groupMap = createGroupMapFromKeys(keys)

  return json<LoaderData>({ keys, pathname, groupMap })
}

export const action: ActionFunction = async ({ request }) => {
  const { pathname } = new URL(request.url)
  await modifyCache(request.method as ModifyCacheMethod)

  return redirect(pathname)
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
        <FormAction title="Refresh" method="get">
          <RefreshIcon aria-label="Refresh" />
        </FormAction>
      ),
    },
    {
      id: "Clear",
      children: (
        <FormAction title="Clear" method="delete">
          <ClearIcon aria-label="Clear" />
        </FormAction>
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
