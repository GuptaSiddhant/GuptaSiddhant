import { useLoaderData, useSubmit } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import ClearIcon from "remixicon-react/DeleteBin2LineIcon"
import DownloadIcon from "remixicon-react/DownloadCloudLineIcon"
import RefreshIcon from "remixicon-react/RefreshLineIcon"

import { ErrorSection } from "~/packages/components/Error"
import type { NavigationLinkProps } from "~/packages/components/Link"
import AdminLayout, { type AdminNavGroup } from "~/packages/layouts/AdminLayout"
import cache, {
  modifyCache,
  parseCacheKey,
} from "~/packages/service/cache.server"

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

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "DELETE": {
      await modifyCache("DELETE")
      break
    }
    case "PUT": {
      await modifyCache("REFRESH")
      break
    }
  }

  return null
}

export default function CacheUI(): JSX.Element | null {
  const { navGroups } = useLoaderData<LoaderData>()
  const submit = useSubmit()

  const actions: NavigationLinkProps[] = [
    {
      id: "Refresh",
      onClick: () => submit({}, { method: "get" }),
      children: <RefreshIcon aria-label="Refresh" />,
    },
    {
      id: "Refetch all",
      onClick: () => submit({}, { method: "put" }),
      children: <DownloadIcon aria-label="Refetch" />,
    },
    {
      id: "Clear all",
      onClick: () => submit({}, { method: "delete" }),
      children: <ClearIcon aria-label="Clear" />,
    },
  ]

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
