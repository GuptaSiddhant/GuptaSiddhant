import { useOutletContext } from "@remix-run/react"

import AdminDashboard from "~/features/admin/components/AdminDashboard"

import { type AdminSettingsOutletContext, handle } from "../settings"

export default function SettingsIndex(): JSX.Element | null {
  const { featureConfigKeys } = useOutletContext<AdminSettingsOutletContext>()

  return (
    <AdminDashboard {...handle.adminApp}>
      <AdminDashboard.Table
        data={[{ count: featureConfigKeys.length }]}
        columns={[{ id: "count", header: "Feature flags" }]}
      />
    </AdminDashboard>
  )
}
