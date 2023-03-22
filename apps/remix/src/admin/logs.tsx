import { useLoaderData } from "@remix-run/react";
import type {
  ErrorBoundaryComponent,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

import { authenticateRoute } from "@gs/service/auth.server";
import { getLoggerNames } from "@gs/service/logger-admin.server";
import { ErrorSection } from "@gs/ui/Error";
import { Caption } from "@gs/ui/Text";

import { AdminAppId, adminRegistry } from "./features";
import { createAdminMeta } from "./features/helpers";
import AdminLayout from "./features/layout";
import type { AdminAppHandle } from "./features/types";

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
