import AdminDashboard from "@features/admin/components/AdminDashboard"
import type { StorageFile } from "@features/service/storage.server"
import { formatDateTime } from "@gs/utils/format"
import { useOutletContext } from "@remix-run/react"
import BackupIcon from "remixicon-react/UploadCloud2FillIcon"

export default function BackupsIndex(): JSX.Element | null {
  const { files } = useOutletContext<{ files: StorageFile[] }>()

  const latest = files.reduce((last, file) => {
    const updatedDateVal = new Date(file.updateTimestamp).valueOf()
    return updatedDateVal > last ? updatedDateVal : last
  }, 0)

  return (
    <AdminDashboard title="Backups" icon={<BackupIcon />}>
      <AdminDashboard.Table
        data={[
          { count: files.length, latest: formatDateTime(new Date(latest)) },
        ]}
        columns={[{ id: "count" }, { id: "latest", header: "Latest" }]}
      />
    </AdminDashboard>
  )
}
