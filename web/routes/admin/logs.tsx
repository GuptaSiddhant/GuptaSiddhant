import { useLoaderData } from "@remix-run/react";
import type {
  ErrorBoundaryComponent,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

import { AdminAppId, adminRegistry } from "@gs/admin";
import { createAdminMeta } from "@gs/admin/helpers";
import AdminLayout from "@gs/admin/layout/AdminLayout";
import type { AdminAppHandle } from "@gs/admin/types";
import { authenticateRoute } from "@gs/service/auth.server";
import { ErrorSection } from "@gs/ui/Error";
import { Caption } from "@gs/ui/Text";
import { getLoggerNames } from "@gs/service/logger-admin.server";

const adminApp = adminRegistry.getApp(AdminAppId.Logs);

interface LoaderData {
  names: string[];
}

export async function loader({ request }: LoaderArgs) {
  await authenticateRoute(request);

  const names = await getLoggerNames();

  return json<LoaderData>({ names });
}

export default function StorageAdminApp(): JSX.Element | null {
  const { names } = useLoaderData<LoaderData>();

  return (
    <AdminLayout
      {...adminApp}
      header={<Caption>{adminApp.title}</Caption>}
      filterPlaceholder="Filter Loggers"
      navGroups={[
        {
          id: "loggers",
          label: "Loggers",
          openByDefault: true,
          children: names.map((name) => ({
            id: name,
            children: name,
            to: name,
          })),
        },
      ]}
    />
  );
}

export const meta: MetaFunction = () => createAdminMeta(adminApp.title);

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorSection title={`Problem with ${adminApp.title}.`} error={error} />
  );
};

export const handle: AdminAppHandle = { adminApp };
