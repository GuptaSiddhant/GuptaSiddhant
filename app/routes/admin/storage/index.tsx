import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import AdminDashboard from "~/features/admin/AdminDashboard"
import { formatDate } from "~/features/helpers/format"
import {
  type FirebaseStorageMetaData,
  getFirebaseStorageMetaData,
} from "~/features/service/storage.server"
import { ExternalLink } from "~/features/ui/Link"

import { handle } from "../storage"

interface LoaderData {
  metadata: FirebaseStorageMetaData
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const metadata = await getFirebaseStorageMetaData()

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
            cell: (row) =>
              formatDate(metadata.updateTimestamp, {
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
          },
        ]}
      />
    </AdminDashboard>
  )
}
