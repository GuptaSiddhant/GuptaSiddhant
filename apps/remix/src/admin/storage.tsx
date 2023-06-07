import { useLoaderData, useRouteError } from "@remix-run/react";
import {
  type DataFunctionArgs,
  json,
  redirect,
} from "@remix-run/server-runtime";

import { RefreshIcon, UploadIcon } from "@gs/icons";
import { UserRole } from "@gs/models/users.model";
import { authenticateRoute } from "@gs/service/auth.server";
import Storage, { type StorageDir } from "@gs/service/storage.server";
import type { NavigationLinkProps } from "@gs/types";
import Action from "@gs/ui/Action";
import { ErrorSection } from "@gs/ui/Error";
import Popover from "@gs/ui/Popover";
import PopoverUpload from "@gs/ui/Popover/Upload";
import { Caption } from "@gs/ui/Text";

import { AdminAppId, adminRegistry } from "./features";
import { createAdminMeta } from "./features/helpers";
import AdminLayout from "./features/layout";
import { generateNavbarGroupsFromStorageDirContents } from "./features/storage/helpers";
import { modifyStorage } from "./features/storage/service.server";
import type { AdminAppHandle } from "./features/types";

const adminApp = adminRegistry.getApp(AdminAppId.Storage);

type LoaderData = StorageDir;

export async function loader({ request }: DataFunctionArgs) {
  await authenticateRoute(request);
  const { dirs, files } = await Storage.queryDir();

  return json<LoaderData>({ dirs, files });
}

export async function action({ request }: DataFunctionArgs) {
  await authenticateRoute(request, UserRole.EDITOR);
  const { method } = request;
  const form = await request.formData();

  const redirectTo = await modifyStorage(method, form);

  return redirect(redirectTo || new URL(request.url).pathname);
}

export default function StorageAdminApp(): JSX.Element | null {
  const { dirs, files } = useLoaderData<LoaderData>();
  const actions: NavigationLinkProps[] = [
    {
      id: "upload",
      children: (
        <Popover title="Upload" content={<PopoverUpload />}>
          <UploadIcon />
        </Popover>
      ),
    },
    {
      id: "refresh",
      children: (
        <Action.Form method="GET" title="Refresh">
          <RefreshIcon />
        </Action.Form>
      ),
    },
  ];

  return (
    <AdminLayout
      {...adminApp}
      className="!overflow-y-hidden overflow-x-scroll"
      actions={actions}
      navGroups={generateNavbarGroupsFromStorageDirContents(dirs, files)}
      header={<Caption>{adminApp.title}</Caption>}
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
