import { useLoaderData } from "@remix-run/react";
import { type LoaderFunction, json } from "@remix-run/server-runtime";

import { authenticateRoute } from "@gs/service/auth.server";
import { getLoggerNames } from "@gs/service/logger-admin.server";

import AdminDashboard from "./features/components/AdminDashboard";
import { useAdminApp } from "./features/helpers";

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
