import { Outlet, useLoaderData } from "@remix-run/react";
import {
  type ActionFunction,
  type LoaderFunction,
  json,
  redirect,
} from "@remix-run/server-runtime";
import BackupIcon from "remixicon-react/UploadCloud2FillIcon";

import { UserRole } from "@gs/models/users.model";
import { authenticateRoute } from "@gs/service/auth.server";
import Storage, { type StorageFile } from "@gs/service/storage.server";
import Action from "@gs/ui/Action";

import backupDatabase, {
  generateBackupNameFromBackupPath,
} from "./features/backup.server";
import AdminLayout from "./features/layout";

interface LoaderData {
  list: string[];
  files: StorageFile[];
}

const pathname = "/admin/settings/backups/";

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request, UserRole.EDITOR);
  const { files } = await Storage.queryDir("backup/");
  const list = files
    .map((file) => generateBackupNameFromBackupPath(file.name))
    .sort((a, b) => (b > a ? 1 : -1));

  return json<LoaderData>({ list, files });
};

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request);

  if (request.method === "POST") {
    const filePath = await backupDatabase();
    return redirect(`${pathname}${filePath}`);
  }

  return null;
};

export default function Backups(): JSX.Element | null {
  const { list, files } = useLoaderData<LoaderData>();

  return (
    <AdminLayout
      title={"Backups"}
      navGroups={[
        {
          id: "backups",
          label: "Backups",
          showCount: true,
          children: list.map((item) => ({
            id: item,
            to: item,
            children: item,
          })),
        },
      ]}
      actions={[
        {
          id: "backup",
          children: (
            <Action action={pathname} method="POST" title="Backup database">
              <BackupIcon />
            </Action>
          ),
        },
      ]}
    >
      <Outlet context={{ files }} />
    </AdminLayout>
  );
}
