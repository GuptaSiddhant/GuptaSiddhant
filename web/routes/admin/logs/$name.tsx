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
import { InputWithRef } from "@gs/ui/Input";
import Button from "@gs/ui/Button";
import FormLabel from "@gs/ui/FormLabel";
import { LogSeverity } from "@gs/constants/logs-constants";
import Tags from "@gs/ui/Tags";

const adminApp = adminRegistry.getApp(AdminAppId.Logs);
const DEFAULT_LIMIT = 20;

interface LoaderData {
  name: string;
  logs: LogItem[];
  limit: number;
  message: string;
  severity?: LogSeverity;
}

export async function loader({ request, params }: LoaderArgs) {
  await authenticateRoute(request);

  const name = params.name;
  invariant(name, "Logger name is missing.");

  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") || DEFAULT_LIMIT);
  const message = String(url.searchParams.get("message") || "");
  const severity = url.searchParams.get("severity") as LogSeverity | undefined;

  const logs = await getLogs(name, { limit, filter: message, severity });

  return json<LoaderData>({ name, logs, limit, message, severity });
}

export async function action({ request, params }: ActionArgs) {
  await authenticateRoute(request, UserRole.EDITOR);

  const name = params.name;
  invariant(name, "Logger name is missing.");

  clearLogCache(name);

  return redirect(adminApp.linkPath + name);
}

export default function LoggerList(): JSX.Element | null {
  const { name, logs, limit, message, severity } = useLoaderData<LoaderData>();

  const columns: TableColumnProps<LogItem>[] = useMemo(
    () => [
      {
        id: "timestamp",
        header: "Timestamp",
        cellClassName: clsx("whitespace-nowrap"),
        cell: (item) => (item.timestamp ? formatDateTime(item.timestamp) : ""),
      },
      {
        id: "severity",
        cell: (item) => <LogSeverityTag severity={item.severity} />,
      },
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
      title={`${name} Logger`}
      to={adminApp.linkPath + name}
      actions={actions}
      footer={
        <FilterForm
          key={name}
          message={message}
          limit={limit}
          severity={severity}
        />
      }
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

function LogSeverityTag({
  severity,
}: { severity?: LogSeverity | null }): JSX.Element | null {
  if (!severity) {
    return null;
  }

  const className: string = (() => {
    switch (severity) {
      case LogSeverity.ALERT:
      case LogSeverity.CRITICAL:
      case LogSeverity.EMERGENCY:
      case LogSeverity.ERROR:
        return clsx(
          "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700",
        );
      case LogSeverity.WARNING:
        return clsx(
          "text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900 border-orange-300 dark:border-orange-700",
        );
      case LogSeverity.NOTICE:
      case LogSeverity.INFO:
        return clsx(
          "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700",
        );
      default:
        return "";
    }
  })();

  return (
    <Tags.Tag className={clsx("!text-sm w-max", className)}>
      {severity}
    </Tags.Tag>
  );
}

function FilterForm({
  message,
  limit,
  severity,
}: {
  message: string;
  limit: number;
  severity?: LogSeverity;
}): JSX.Element | null {
  const uuid = useId();
  const messageInputId = `${uuid}-message-input`;
  const limitSelectId = `${uuid}-limit-select`;
  const severitySelectId = `${uuid}-severity-select`;

  return (
    <div className="flex gap-4 items-center w-full">
      <div className="border-r pr-4 whitespace-nowrap flex gap-2 items-center">
        <FilterIcon /> Filter logs
      </div>
      <Form
        method="get"
        className="flex gap-4 items-center justify-between w-full"
      >
        <fieldset className="flex gap-2 items-center flex-wrap w-full">
          <Select
            label="Severity"
            name="severity"
            defaultValue={severity}
            id={severitySelectId}
          >
            <Select.Option value={""}>ALL</Select.Option>
            {Object.values(LogSeverity).map((value) => (
              <Select.Option key={value} value={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
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
          <FormLabel
            label="Message"
            className="text-sm flex-1"
            labelClassName="!flex-initial"
            htmlFor={messageInputId}
          >
            <InputWithRef
              id={messageInputId}
              name="Message"
              type="search"
              defaultValue={message}
              placeholder="Filter by message..."
              className="flex-1"
            />
          </FormLabel>
        </fieldset>

        <Button.Primary type="submit" className="!h-8">
          Filter
        </Button.Primary>
      </Form>
    </div>
  );
}
