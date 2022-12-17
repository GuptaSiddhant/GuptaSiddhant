import { Form, useLoaderData } from "@remix-run/react";
import {
  ActionArgs,
  json,
  LoaderArgs,
  redirect,
} from "@remix-run/server-runtime";
import clsx from "clsx";
import { useId, useMemo } from "react";

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
import { FilterIcon, RefreshIcon } from "@gs/icons";
import { UserRole } from "@gs/models/users";
import Select from "@gs/ui/Select";
import Input from "@gs/ui/Input";
import Button from "@gs/ui/Button";
import FormLabel from "@gs/ui/FormLabel";

const adminApp = adminRegistry.getApp(AdminAppId.Logs);

interface LoaderData {
  name: string;
  logs: LogItem[];
  limit: number;
  filter: string;
}

export async function loader({ request, params }: LoaderArgs) {
  await authenticateRoute(request);

  const name = params.name;
  invariant(name, "Logger name is missing.");

  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") || 10);
  const filter = String(url.searchParams.get("filter") || "");

  const logs = await getLogs(name, { limit, filter });

  return json<LoaderData>({ name, logs, limit, filter });
}

export async function action({ request, params }: ActionArgs) {
  await authenticateRoute(request, UserRole.EDITOR);

  const name = params.name;
  invariant(name, "Logger name is missing.");

  clearLogCache(name);

  return redirect(adminApp.linkPath + name);
}

export default function LoggerList(): JSX.Element | null {
  const { name, logs, limit, filter } = useLoaderData<LoaderData>();

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
    <AdminLayout
      title={name}
      to={adminApp.linkPath + name}
      actions={actions}
      footer={<FilterForm filter={filter} limit={limit} />}
    >
      <Table
        columns={columns}
        data={logs}
        headRowClassName={clsx("border-b border-divider bg-default")}
        headCellClassName={clsx(
          "px-4 py-2 text-secondary text-sm text-left border-r border-divider",
        )}
        bodyCellClassName={clsx(
          "text-left px-4 py-2 font-monospace text-sm border-b border-divider",
        )}
      />
    </AdminLayout>
  );
}

function FilterForm({ filter, limit }: { filter: string; limit: number }) {
  const uuid = useId();
  const filterInputId = `${uuid}-filter-input`;
  const limitSelectId = `${uuid}-limit-select`;

  return (
    <div className="flex gap-4 items-center w-full">
      <div className="border-r pr-4 whitespace-nowrap">Filter logs</div>
      <Form
        method="get"
        className="flex gap-4 items-center justify-between w-full"
      >
        <fieldset className="flex gap-2 items-center flex-wrap">
          <FormLabel label="Text" className="text-sm" htmlFor={filterInputId}>
            <Input
              id={filterInputId}
              name="filter"
              type="search"
              defaultValue={filter}
              placeholder="Filter logs by text..."
            />
          </FormLabel>
          <Select
            label="Limit"
            name="limit"
            defaultValue={limit}
            id={limitSelectId}
          >
            {[10, 20, 50, 100].map((value) => (
              <Select.Option key={value} value={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </fieldset>

        <Button.Primary type="submit" className="!h-8">
          <FilterIcon /> Filter
        </Button.Primary>
      </Form>
    </div>
  );
}
