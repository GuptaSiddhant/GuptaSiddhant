import { transformMsToReadableString } from "@gs/utils/format"
import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import AdminDashboard from "~/features/admin/components/AdminDashboard"
import { authenticateRoute } from "~/features/service/auth.server"
import { getCache } from "~/features/service/cache.server"

import { handle } from "../cache"

interface LoaderData {
  max: number
  size: number
  ttl: number
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)
  const { size, max, ttl } = getCache()

  return json<LoaderData>({ size, max, ttl })
}

export default function CacheIndex(): JSX.Element | null {
  const { size, max, ttl } = useLoaderData<LoaderData>()

  return (
    <AdminDashboard {...handle.adminApp}>
      <AdminDashboard.Table
        data={[{ size, max, ttl }]}
        columns={[
          { id: "size", header: "Entries" },
          {
            id: "max",
            header: "Size limit",
            cell: ({ max }) => `${max} entries`,
          },
          {
            id: "ttl",
            header: "Expiry time",
            cell: ({ ttl }) => <span>{transformMsToReadableString(ttl)}</span>,
          },
        ]}
      />
    </AdminDashboard>
  )
}