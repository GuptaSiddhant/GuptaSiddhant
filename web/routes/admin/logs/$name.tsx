import { useLoaderData } from "@remix-run/react";
import {
  ActionArgs,
  json,
  LoaderArgs,
  redirect,
} from "@remix-run/server-runtime";
import clsx from "clsx";
import { useMemo } from "react";

import { AdminAppId, adminRegistry } from "@gs/admin";
import AdminLayout from "@gs/admin/layout/AdminLayout";
import { authenticateRoute } from "@gs/service/auth.server";
import {
  clearLogCache,
  getLogs,
  LogItem,
} from "@gs/service/logger-admin.server";
import Table, { TableColumnProps } from "@gs/ui/Table";
import invariant from "@gs/utils/invariant";
import { formatDateTime } from "@gs/utils/format";
import { NavigationLinkProps } from "@gs/navigation/types";
import Action from "@gs/ui/Action";
import { RefreshIcon } from "@gs/icons";
import { UserRole } from "@gs/models/users";

const adminApp = adminRegistry.getApp(AdminAppId.Logs);

interface LoaderData {
  name: string;
  logs: LogItem[];
}

export async function loader({ request, params }: LoaderArgs) {
  await authenticateRoute(request);

  const name = params.name;
  invariant(name, "Logger name is missing.");

  const logs = await getLogs(name);

  return json<LoaderData>({ name, logs });
}

export async function action({ request, params }: ActionArgs) {
  await authenticateRoute(request, UserRole.EDITOR);

  const name = params.name;
  invariant(name, "Logger name is missing.");

  clearLogCache(name);

  return redirect(adminApp.linkPath + name);
}

export default function LoggerList(): JSX.Element | null {
  const { name, logs } = useLoaderData<LoaderData>();

  const columns: TableColumnProps<LogItem>[] = useMemo(
    () => [
      {
        id: "timestamp",
        header: "Timestamp",
        cellClassName: clsx("whitespace-nowrap"),
        cell: (item) => (item.timestamp ? formatDateTime(item.timestamp) : ""),
      },
      { id: "severity" },
      {
        id: "data",
        header: "Message",
        cellClassName: clsx("w-full"),
      },
    ],
    [],
  );

  const actions: NavigationLinkProps[] = [
    {
      id: "Reload",
      children: (
        <Action title="Reload logs" method="post" toast="Reloading logs">
          <RefreshIcon />
        </Action>
      ),
    },
  ];

  return (
    <AdminLayout title={name} to={adminApp.linkPath + name} actions={actions}>
      <Table
        columns={columns}
        data={logs}
        headRowClassName={clsx("border-b border-divider bg-default")}
        headCellClassName={clsx(
          "px-4 py-2 text-secondary text-left border-r border-divider",
        )}
        bodyCellClassName={clsx(
          "text-left px-4 py-2 font-monospace text-sm border-b border-divider",
        )}
      />
    </AdminLayout>
  );
}
