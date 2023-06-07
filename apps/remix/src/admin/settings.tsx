import type { DataFunctionArgs } from "@remix-run/server-runtime";

import { authenticateRoute } from "@gs/service/auth.server";
import { ErrorSection } from "@gs/ui/Error";
import { Caption } from "@gs/ui/Text";

import { AdminAppId, adminRegistry } from "./features";
import { createAdminMeta } from "./features/helpers";
import AdminLayout, { type AdminNavbarGroupProps } from "./features/layout";
import type { AdminAppHandle } from "./features/types";
import { useRouteError } from "@remix-run/react";

const adminApp = adminRegistry.getApp(AdminAppId.Settings);

export async function loader({ request }: DataFunctionArgs) {
  await authenticateRoute(request);

  return null;
}

export default function SettingsAdminApp(): JSX.Element | null {
  const navGroups: AdminNavbarGroupProps[] = [
    {
      id: "settings",
      label: "Settings",
      openByDefault: true,
      children: [
        {
          id: "feature-flags",
          to: "feature-flags",
          children: "Feature flags",
        },
        {
          id: "backups",
          to: "backups",
          children: "Backups",
        },
      ],
    },
  ];

  return (
    <AdminLayout
      {...adminApp}
      header={<Caption>{adminApp.title}</Caption>}
      navGroups={navGroups}
    />
  );
}

export const meta = createAdminMeta(adminApp.title);

export function ErrorBoundary() {
  return (
    <ErrorSection
      error={useRouteError()}
      title={`Problem with ${adminApp.title}.`}
    />
  );
}

export const handle: AdminAppHandle = { adminApp };
