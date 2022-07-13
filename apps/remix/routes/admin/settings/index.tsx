import AdminDashboard from "@features/admin/components/AdminDashboard"
import { useAdminApp } from "@features/admin/helpers"
import { authenticateRoute } from "@features/service/auth.server"
import { queryFirebaseRemoteConfigKeys } from "@gs/firebase/remote-config"
import { useLoaderData } from "@remix-run/react"
import { type LoaderFunction, json } from "@remix-run/server-runtime"

interface LoaderData {
  featureConfigKeys: string[]
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)
  const featureConfigKeys = await queryFirebaseRemoteConfigKeys()

  return json<LoaderData>({ featureConfigKeys })
}

export default function SettingsIndex(): JSX.Element | null {
  const { featureConfigKeys } = useLoaderData<LoaderData>()
  const adminApp = useAdminApp()

  return (
    <AdminDashboard {...adminApp}>
      <AdminDashboard.Table
        data={[{ count: featureConfigKeys.length || 0 }]}
        columns={[{ id: "count", header: "Feature flags" }]}
      />
    </AdminDashboard>
  )
}
