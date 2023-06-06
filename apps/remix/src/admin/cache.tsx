import ClearIcon from "remixicon-react/DeleteBin2FillIcon";
import RefreshIcon from "remixicon-react/RefreshFillIcon";

import { useLoaderData, useRouteError } from "@remix-run/react";
import type {
  ActionFunction,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";

import { DeleteIcon } from "@gs/icons";
import { authenticateRoute } from "@gs/service/auth.server";
import {
  type ModifyCacheMethod,
  getCache,
  modifyCache,
  parseCacheKey,
} from "@gs/service/cache.server";
import type { NavigationLinkProps } from "@gs/types";
import Action from "@gs/ui/Action";
import { ErrorSection } from "@gs/ui/Error";
import { Caption } from "@gs/ui/Text";

import { AdminAppId, adminRegistry } from "./features";
import { createAdminMeta, useAdminApp } from "./features/helpers";
import AdminLayout, { type AdminNavbarGroupProps } from "./features/layout";
import type { AdminAppHandle } from "./features/types";

const adminApp = adminRegistry.getApp(AdminAppId.Cache);

export const loader = async ({ request }: LoaderArgs) => {
  await authenticateRoute(request);

  const keys = [...getCache().keys()].sort();

  const groupMap = createGroupMapFromKeys(keys);
  return json({ keys, groupMap });
};

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request);
  const { pathname } = new URL(request.url);

  await modifyCache(request.method as ModifyCacheMethod);

  return redirect(pathname);
};

export default function CacheAdminApp(): JSX.Element | null {
  const adminApp = useAdminApp();
  const { groupMap } = useLoaderData<typeof loader>();

  const navGroups = Object.keys(groupMap).map((type) => ({
    id: type,
    label: type.toUpperCase().replace(/-/g, " "),
    showCount: true,
    children: groupMap[type],
    actions: (
      <Action
        title={`Clear cache for '${type}'.`}
        method="delete"
        confirm={`Are you sure about clearing '${type}' cache?`}
        toast={`Clearing '${type}' cache ...`}
        action={adminApp.linkPath + type}
        body={{ key: type }}
      >
        <DeleteIcon />
      </Action>
    ),
  })) as AdminNavbarGroupProps[];

  const actions: NavigationLinkProps[] = [
    {
      id: "Refresh",
      children: (
        <Action
          title="Refresh cache"
          method="patch"
          toast="Refreshing cache..."
          action={adminApp.linkPath}
        >
          <RefreshIcon />
        </Action>
      ),
    },
    {
      id: "Clear",
      children: (
        <Action
          title="Clear cache"
          method="delete"
          confirm="Are you sure about clearing cache?"
          toast="Clearing cache..."
          action={adminApp.linkPath}
        >
          <ClearIcon />
        </Action>
      ),
    },
  ];

  return (
    <AdminLayout
      {...adminApp}
      header={<Caption>{adminApp.title}</Caption>}
      actions={actions}
      navGroups={navGroups}
    />
  );
}

function createGroupMapFromKeys(keys: string[]) {
  const groupMap: Record<string, NavigationLinkProps[]> = {};

  keys.forEach((key) => {
    const { type, value } = parseCacheKey(key) || {};
    if (type) {
      groupMap[type] = groupMap[type] || [];
      groupMap[type].push({
        id: key,
        to: key,
        children: value || type,
      });
    }
  });

  return groupMap;
}

export const meta: MetaFunction = () => createAdminMeta(adminApp.title);

export function ErrorBoundary() {
  return (
    <ErrorSection
      error={useRouteError()}
      title={`Problem with ${adminApp.title}.`}
    />
  );
}

export const handle: AdminAppHandle = { adminApp };
