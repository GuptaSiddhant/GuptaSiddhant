import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import AdminDashboard from "@gs/admin/components/AdminDashboard"
import { useAdminApp } from "@gs/admin/helpers"
import useRootContext from "@gs/root/RootContext"
import { authenticateRoute } from "@gs/service/auth.server"
import Storage, { type StorageMetadata } from "@gs/service/storage.server"
import { ExternalLink } from "@gs/ui/Link"
import { formatDateTime } from "@gs/utils/format"

interface LoaderData {
  metadata?: StorageMetadata
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)
  try {
    const metadata = await Storage.queryMetadata()

    return json<LoaderData>({ metadata })
  } catch {
    return json<LoaderData>({})
  }
}

export default function StorageIndex(): JSX.Element | null {
  const { locale } = useRootContext()
  const { metadata } = useLoaderData<LoaderData>()
  const adminApp = useAdminApp()

  if (!metadata) {
    return <AdminDashboard {...adminApp} children={null} />
  }

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
            cell: (row) => formatDateTime(row.updateTimestamp, { locale }),
          },
        ]}
      />
    </AdminDashboard>
  )
}
