import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  data,
  redirect,
  useLoaderData,
} from "react-router";

import { DeleteIcon } from "@gs/icons";
import useRootContext from "@gs/root/RootContext";
import { authenticateRoute } from "@gs/service/auth.server";
import { UserRole } from "@gs/models/users.model";
import type { StorageFile } from "@gs/service/storage.server";
import Storage from "@gs/service/storage.server";
import Action from "@gs/ui/Action";
import CodeBlock from "@gs/ui/CodeBlock";
import { getDeleteConfirmProps } from "@gs/ui/Popover/Confirm";
import { formatDateTime } from "@gs/utils/format";
import invariant from "@gs/utils/invariant";

import { AdminAppId, adminRegistry } from "./features";
import { generateBackupPathFromBackupName } from "./features/backup.server";
import AdminLayout from "./features/layout";

const adminApp = adminRegistry.getApp(AdminAppId.Settings);

interface LoaderData {
  name: string;
  path: string;
  asset: StorageFile;
  data: string;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticateRoute(request, UserRole.ADMIN);
  const name = params["name"];
  invariant(name, "Filename is required");

  const path = generateBackupPathFromBackupName(name);

  try {
    const asset = await Storage.queryAsset(path);
    const file = await Storage.downloadAsset(path);
    const fileData = JSON.stringify(JSON.parse(await file.text()), null, 2);

    return data<LoaderData>({ asset, name, path, data: fileData });
  } catch {
    return redirect(`${adminApp.linkPath}backups`);
  }
}

export async function action({ request }: ActionFunctionArgs) {
  await authenticateRoute(request, UserRole.ADMIN);

  const form = await request.formData();
  const originPath = form.get("originPath")?.toString() || "/";

  if (request.method === "DELETE") {
    const path = form.get("path")?.toString();
    invariant(path, "Asset path is required.");
    await Storage.mutateAsset(path);

    return redirect(`${adminApp.linkPath}backups`);
  }

  return redirect(originPath);
}

export default function StoragePath(): JSX.Element | null {
  const { name, path, data, asset } = useLoaderData<LoaderData>();
  const { locale } = useRootContext();

  return (
    <AdminLayout
      title={name}
      className="p-4"
      footer={
        <div className="flex justify-between text-base text-disabled">
          Backup on{" "}
          {formatDateTime(new Date(asset.updateTimestamp), { locale })}
        </div>
      }
      actions={[
        {
          id: "Delete",
          children: (
            <Action
              method="DELETE"
              body={{ path }}
              title="Delete backup"
              confirm={getDeleteConfirmProps("backup")}
              toast="Deleting backup..."
            >
              <DeleteIcon />
            </Action>
          ),
        },
      ]}
    >
      <CodeBlock lang="json" wrap className="!m-0">
        {data}
      </CodeBlock>
    </AdminLayout>
  );
}
