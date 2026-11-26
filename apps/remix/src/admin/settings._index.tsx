import { type LoaderFunctionArgs, data, useLoaderData } from "react-router";

import {
  queryFirebaseRemoteConfigKeys,
  queryFirebaseRemoteConfigTemplate,
} from "@gs/firebase/remote-config";
import { authenticateRoute } from "@gs/service/auth.server";
import { UserRole } from "@gs/models/users.model";

import AdminDashboard from "./features/components/AdminDashboard";
import { useAdminApp } from "./features/helpers";

interface LoaderData {
  featureConfigKeys: string[];
}

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticateRoute(request, UserRole.ADMIN);
  const template = await queryFirebaseRemoteConfigTemplate();
  const featureConfigKeys = await queryFirebaseRemoteConfigKeys(template);

  return data<LoaderData>({ featureConfigKeys });
}

export default function SettingsIndex(): JSX.Element | null {
  const { featureConfigKeys } = useLoaderData<LoaderData>();
  const adminApp = useAdminApp();

  return (
    <AdminDashboard {...adminApp}>
      <AdminDashboard.Table
        data={[{ count: featureConfigKeys.length || 0 }]}
        columns={[{ id: "count", header: "Feature flags" }]}
      />
    </AdminDashboard>
  );
}
