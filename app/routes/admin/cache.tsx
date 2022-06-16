import { useLoaderData, useSubmit } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import CacheIcon from "remixicon-react/Database2FillIcon"
import ClearIcon from "remixicon-react/DeleteBin2LineIcon"
import RefreshIcon from "remixicon-react/RefreshFillIcon"

import { ErrorSection } from "~/packages/components/Error"
import type { NavigationLinkProps } from "~/packages/components/Link"
import { Caption } from "~/packages/components/Text"
import type { AdminAppProps } from "~/packages/layouts/AdminLayout"
import AdminLayout, {
  type AdminNavGroupProps,
} from "~/packages/layouts/AdminLayout"
import cache, {
  modifyCache,
  parseCacheKey,
} from "~/packages/service/cache.server"

const adminApp: AdminAppProps = {
  id: "cache",
  name: "Cache",
  icon: <CacheIcon />,
}

interface LoaderData {
  navGroups: AdminNavGroupProps[]
  pathname: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const keys = [...cache.keys()].sort()
  const navLinks: NavigationLinkProps[] = keys.map((key) => {
    const { type, value } = parseCacheKey(key) || {}
    return {
      id: key,
      to: key,
      children: value || type,
    }
  })
  const navGroups = groupNavLinks(navLinks)
  const { pathname } = new URL(request.url)

  return json<LoaderData>({ navGroups, pathname })
}

export const action: ActionFunction = async ({ request }) => {
  const { pathname } = new URL(request.url)
  const method = request.method as "DELETE" | "POST" | "PUT"
  await modifyCache(method)

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

function groupNavLinks(links: NavigationLinkProps[]): AdminNavGroupProps[] {
  const groupMap: Record<string, NavigationLinkProps[]> = {}

  links.forEach((link) => {
    const { type } = parseCacheKey(link.id) || {}
    if (type) {
      groupMap[type] = groupMap[type] || []
      groupMap[type].push(link)
    }
  })

  return Object.keys(groupMap).map((type) => ({
    id: type,
    label: type,
    children: groupMap[type],
  }))
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Problem with CacheUI" message={error.message} />
}

export const handle = {
  adminApp,
}
