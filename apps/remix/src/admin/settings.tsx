import { type LoaderFunctionArgs, useRouteError } from "react-router";

import { authenticateRoute } from "@gs/service/auth.server";
import { UserRole } from "@gs/models/users.model";
import { ErrorSection } from "@gs/ui/Error";
import { Caption } from "@gs/ui/Text";

import { AdminAppId, adminRegistry } from "./features";
import { createAdminMeta } from "./features/helpers";
import AdminLayout, { type AdminNavbarGroupProps } from "./features/layout";
import type { AdminAppHandle } from "./features/types";

const adminApp = adminRegistry.getApp(AdminAppId.Settings);

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticateRoute(request, UserRole.ADMIN);

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
