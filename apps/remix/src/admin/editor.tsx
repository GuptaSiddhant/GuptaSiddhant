import NewIcon from "remixicon-react/AddBoxFillIcon";

import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { type LoaderFunction, json } from "@remix-run/server-runtime";

import { ModelName, getLabelByModelName } from "@gs/models";
import { getAboutKeys } from "@gs/models/about.server";
import { getBlogKeys } from "@gs/models/blog.server";
import { getCareerKeys } from "@gs/models/career.server";
import { getEducationKeys } from "@gs/models/education.server";
import { getProjectsKeys } from "@gs/models/projects.server";
import { getUsersKeys } from "@gs/models/users.server";
import {
  authenticateRoute,
  isUserHasWriteAccess,
} from "@gs/service/auth.server";
import type { NavigationLinkProps } from "@gs/types";
import { ErrorSection } from "@gs/ui/Error";
import Menu from "@gs/ui/Menu";
import { Caption } from "@gs/ui/Text";

import { AdminAppId, adminRegistry } from "./features";
import { createAdminMeta } from "./features/helpers";
import AdminLayout, { type AdminNavbarGroupProps } from "./features/layout";
import type { AdminAppHandle } from "./features/types";

const adminApp = adminRegistry.getApp(AdminAppId.Editor);

export interface LoaderData {
  entries: {
    id: ModelName;
    label: string;
    keys: string[];
    allowNew?: boolean;
  }[];
  hasWriteAccess: boolean;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticateRoute(request);
  const hasWriteAccess = await isUserHasWriteAccess(user);

  const [
    careerKeys,
    educationKeys,
    blogKeys,
    projectsKeys,
    aboutKeys,
    usersKeys,
  ] = await Promise.all([
    getCareerKeys(),
    getEducationKeys(),
    getBlogKeys(),
    getProjectsKeys(),
    getAboutKeys(),
    getUsersKeys(),
  ]);

  const entries: LoaderData["entries"] = [
    { id: ModelName.About, keys: aboutKeys, allowNew: false },
    { id: ModelName.Career, keys: careerKeys },
    { id: ModelName.Education, keys: educationKeys },
    { id: ModelName.Blog, keys: blogKeys },
    { id: ModelName.Projects, keys: projectsKeys },
    { id: ModelName.Users, keys: usersKeys },
  ]
    .map((entry) => ({ ...entry, label: getLabelByModelName(entry.id) }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return json<LoaderData>({ entries, hasWriteAccess });
};

export default function EditorAdminApp(): JSX.Element | null {
  const loaderData = useLoaderData<LoaderData>();
  const { entries, hasWriteAccess } = loaderData;

  const navGroups: AdminNavbarGroupProps[] = entries.map(
    ({ id, label, keys }) => ({
      id,
      label,
      showCount: true,
      children: keys.map((key) => ({
        id: key,
        children: key,
        to: `${id}/${key}`,
      })),
    }),
  );

  const actions: NavigationLinkProps[] = [
    {
      id: "new",
      children: (
        <Menu
          actions={entries
            .filter((e) => e.allowNew !== false)
            .map((e) => ({
              id: e.id,
              children: `New ${e.label}`,
              to: `${e.id}/new`,
            }))}
        >
          <NewIcon />
        </Menu>
      ),
    },
  ];

  return (
    <AdminLayout
      {...adminApp}
      header={<Caption>{adminApp.title}</Caption>}
      navGroups={navGroups}
      actions={hasWriteAccess ? actions : undefined}
    >
      <Outlet context={loaderData} />
    </AdminLayout>
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
