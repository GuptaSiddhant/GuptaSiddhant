import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  Outlet,
  data,
  redirect,
  useLoaderData,
} from "react-router";
import { RiUploadCloud2Fill as BackupIcon } from "@remixicon/react";

import { UserRole } from "@gs/models/users.model";
import { authenticateRoute } from "@gs/service/auth.server";
import Storage, { type StorageFile } from "@gs/service/storage.server";
import Action from "@gs/ui/Action";

import backupDatabase, {
  generateBackupNameFromBackupPath,
} from "./features/backup.server";
import { createAdminMeta } from "./features/helpers";
import AdminLayout from "./features/layout";

interface LoaderData {
  list: string[];
  files: StorageFile[];
}

const pathname = "/admin/settings/backups/";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticateRoute(request, UserRole.ADMIN);
  const { files } = await Storage.queryDir("backup/");
  const list = files
    .map((file) => generateBackupNameFromBackupPath(file.name))
    .sort((a, b) => (b > a ? 1 : -1));

  return data<LoaderData>({ list, files });
}

export async function action({ request }: ActionFunctionArgs) {
  await authenticateRoute(request, UserRole.ADMIN);

  if (request.method === "POST") {
    const filePath = await backupDatabase();
    return redirect(`${pathname}${filePath}`);
  }

  return null;
}

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

export const meta = createAdminMeta("Backups");
