import { useFetcher, useLoaderData, useSubmit } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import CacheIcon from "remixicon-react/Database2FillIcon"
import ClearIcon from "remixicon-react/DeleteBin2LineIcon"
import DownloadIcon from "remixicon-react/DownloadCloudLineIcon"
import RefreshIcon from "remixicon-react/RefreshLineIcon"

import { ErrorSection } from "~/packages/components/Error"
import type { NavigationLinkProps } from "~/packages/components/Link"
import { Caption } from "~/packages/components/Text"
import AdminLayout, {
  type AdminNavGroupProps,
} from "~/packages/layouts/AdminLayout"
import cache, {
  modifyCache,
  parseCacheKey,
} from "~/packages/service/cache.server"

interface LoaderData {
  navGroups: AdminNavGroupProps[]
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

  return json<LoaderData>({ navGroups })
}

export const action: ActionFunction = async ({ request }) => {
  const method = request.method as "DELETE" | "POST" | "PUT"

  const form = await request.formData()
  const key = form.get("key")?.toString()

  await modifyCache(method, key)

  return redirect("/admin/cache/" + (key && method !== "DELETE" ? key : ""))
}

export default function CacheUI(): JSX.Element | null {
  const fetcher = useFetcher<LoaderData>()
  const submit = useSubmit()
  const loaderData = useLoaderData<LoaderData>()
  const fetcherData = fetcher.data

  const actions: NavigationLinkProps[] = [
    {
      id: "Refresh",
      onClick: () => submit({}, { method: "get", replace: true }),
      children: <RefreshIcon aria-label="Refresh" />,
    },
    {
      id: "Refetch all",
      onClick: () => submit({}, { method: "put", replace: true }),
      children: <DownloadIcon aria-label="Refetch" />,
    },
    {
      id: "Clear all",
      onClick: () => submit({}, { method: "delete", replace: true }),
      children: <ClearIcon aria-label="Clear" />,
    },
  ]

  const { navGroups } = fetcherData || loaderData

  return (
    <AdminLayout
      name="Cache"
      icon={<CacheIcon />}
      header={<Caption>Cache</Caption>}
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
