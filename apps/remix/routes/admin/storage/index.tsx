import { formatDateTime } from "@gs/utils/format"
import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import AdminDashboard from "~/features/admin/components/AdminDashboard"
import { authenticateRoute } from "~/features/service/auth.server"
import storage, {
  type StorageMetadata,
} from "~/features/service/storage.server"
import { ExternalLink } from "~/features/ui/Link"

import { handle } from "../storage"

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

  return (
    <AdminDashboard {...handle.adminApp}>
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
