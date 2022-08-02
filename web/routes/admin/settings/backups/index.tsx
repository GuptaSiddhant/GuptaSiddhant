import BackupIcon from "remixicon-react/UploadCloud2FillIcon"

import { useOutletContext } from "@remix-run/react"

import AdminDashboard from "@gs/admin/components/AdminDashboard"
import useRootContext from "@gs/root/RootContext"
import type { StorageFile } from "@gs/service/storage.server"
import { formatDateTime } from "@gs/utils/format"

export default function BackupsIndex(): JSX.Element | null {
  const { locale } = useRootContext()
  const { files } = useOutletContext<{ files: StorageFile[] }>()

  const latest = files.reduce((last, file) => {
    const updatedDateVal = new Date(file.updateTimestamp).valueOf()
    return updatedDateVal > last ? updatedDateVal : last
  }, 0)

  return (
    <AdminDashboard title="Backups" icon={<BackupIcon />}>
      <AdminDashboard.Table
        data={[
          {
            count: files.length,
            latest: formatDateTime(new Date(latest), { locale }),
          },
        ]}
        columns={[{ id: "count" }, { id: "latest", header: "Latest" }]}
      />
    </AdminDashboard>
  )
}
