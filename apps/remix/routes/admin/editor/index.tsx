import { useOutletContext } from "@remix-run/react"

import AdminDashboard from "~/features/admin/components/AdminDashboard"
import { useAdminApp } from "~/features/admin/helpers"
import Table from "~/features/ui/Table"

import { type LoaderData } from "../editor"

export default function EditorIndex(): JSX.Element | null {
  const { entries } = useOutletContext<LoaderData>()
  const adminApp = useAdminApp()

  return (
    <AdminDashboard {...adminApp}>
      <Table
        data={entries}
        columns={[
          {
            id: "label",
            header: "Collection",
          },
          {
            id: "list",
            header: "Entries",
            cell: (row) => row.list.length,
          },
        ]}
        headRowClassName={"border-b border-divider"}
        headCellClassName="px-4 py-2 text-secondary text-base text-left"
        bodyCellClassName="px-4 py-2 min-w-[4rem]  text-left"
        bodyRowClassName="border-b border-divider"
      />
    </AdminDashboard>
  )
}
