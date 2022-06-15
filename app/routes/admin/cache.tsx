import { useFetcher, useLoaderData, useSubmit } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import ClearIcon from "remixicon-react/DeleteBin2LineIcon"
import DownloadIcon from "remixicon-react/DownloadCloudLineIcon"
import RefreshIcon from "remixicon-react/RefreshLineIcon"

import { ErrorSection } from "~/packages/components/Error"
import type { NavigationLinkProps } from "~/packages/components/Link"
import AdminLayout, { type AdminNavGroup } from "~/packages/layouts/AdminLayout"
import cache, { parseCacheKey } from "~/packages/service/cache.server"

import { action as apiAction } from "./cache/api"

interface LoaderData {
  navGroups: AdminNavGroup[]
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

export const action: ActionFunction = async (props) => {
  return apiAction(props)
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

  return <AdminLayout name="Cache" actions={actions} navGroups={navGroups} />
}

function groupNavLinks(links: NavigationLinkProps[]): AdminNavGroup[] {
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
