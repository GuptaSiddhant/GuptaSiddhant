import { useLoaderData } from "@remix-run/react";
import { type LoaderFunction, json } from "@remix-run/server-runtime";

import AdminDashboard from "@gs/admin/components/AdminDashboard";
import { useAdminApp } from "@gs/admin/helpers";
import { authenticateRoute } from "@gs/service/auth.server";
import { getLoggerNames } from "@gs/service/logger-admin.server";

interface LoaderData {
  names: string[];
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request);

  const names = await getLoggerNames();

  return json<LoaderData>({ names });
};

export default function LogsIndex(): JSX.Element | null {
  const { names } = useLoaderData<LoaderData>();
  const adminApp = useAdminApp();

  return (
    <AdminDashboard {...adminApp}>
      <AdminDashboard.Table
        data={[{ count: names.length || 0 }]}
        columns={[{ id: "count", header: "Loggers" }]}
      />
    </AdminDashboard>
  );
}
