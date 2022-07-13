import AdminDashboard from "@gs/admin/components/AdminDashboard"
import { useAdminApp } from "@gs/admin/helpers"
import { authenticateRoute } from "@gs/service/auth.server"
import storage, { type StorageMetadata } from "@gs/service/storage.server"
import { ExternalLink } from "@gs/ui/Link"
import { formatDateTime } from "@gs/utils/format"
import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

interface LoaderData {
  metadata: StorageMetadata
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)
  const metadata = await storage.queryMetadata()

  return json<LoaderData>({ metadata })
}

export default function StorageIndex(): JSX.Element | null {
  const { metadata } = useLoaderData<LoaderData>()
  const adminApp = useAdminApp()

  return (
    <AdminDashboard {...adminApp}>
      <AdminDashboard.Table
        data={[metadata]}
        columns={[
          {
            id: "id",
            header: "Name",
            cell: (row) => (
              <ExternalLink href={row.link}>{row.name || row.id}</ExternalLink>
            ),
          },
          { id: "location" },
          {
            id: "updateTimestamp",
            header: "Last Updated",
            cell: (row) => formatDateTime(row.updateTimestamp),
          },
        ]}
      />
    </AdminDashboard>
  )
}
