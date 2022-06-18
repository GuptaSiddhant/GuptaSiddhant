import clsx from "clsx"
import { useMemo } from "react"
import DeleteBin2FillIcon from "remixicon-react/DeleteBin2LineIcon"
import ToggleOnIcon from "remixicon-react/ToggleFillIcon"
import ToggleOffIcon from "remixicon-react/ToggleLineIcon"

import AdminFormAction from "~/features/admin/AdminFormAction"
import {
  type FeatureFlagJson,
  type FeatureFlagsMap,
} from "~/features/service/remote-config.server"
import Table, { type TableColumnProps } from "~/features/ui/Table"

export interface FeatureFlagsTableProps {
  featureFlags: FeatureFlagsMap
}

interface FeatureFlagsTableData extends FeatureFlagJson {
  flag: string
}

export default function FeatureFlagsTable({
  featureFlags,
}: FeatureFlagsTableProps) {
  const tableData: FeatureFlagsTableData[] = useMemo(
    () =>
      Object.entries(featureFlags).map(([flag, { dev, prod }]) => ({
        flag,
        dev,
        prod,
      })),
    [featureFlags],
  )

  const tableColumns: TableColumnProps<FeatureFlagsTableData>[] = useMemo(
    () => [
      { id: "flag" },
      {
        id: "dev",
        cell: (_, row) => <ToggleCell dev row={row} />,
      },
      {
        id: "prod",
        cell: (_, row) => <ToggleCell row={row} />,
      },
      {
        id: "actions",
        cell: (_, row) => <ActionCell {...row} />,
      },
    ],
    [],
  )

  return (
    <Table
      className="flex-1 h-max"
      data={tableData}
      columns={tableColumns}
      headCellClassName="px-4 py-2 text-secondary text-base text-left"
      bodyCellClassName="px-4 py-2 min-w-[4rem]  text-left"
      bodyRowClassName="border-b border-divider"
      headRowClassName="border-b border-divider"
    />
  )
}

function ToggleCell({
  row,
  dev,
}: {
  row: FeatureFlagsTableData
  dev?: boolean
}) {
  const value: boolean = dev ? row.dev : row.prod

  return (
    <div className="flex">
      <AdminFormAction
        method="post"
        title="Delete flag"
        body={{ ...row, [dev ? "dev" : "prod"]: !value }}
      >
        <span
          className={clsx(
            "font-monospace text-base",
            value ? "text-success" : "text-danger",
          )}
        >
          {value ? "enabled" : "disabled"}
        </span>
      </AdminFormAction>
    </div>
  )
}

function ActionCell({ flag, dev, prod }: FeatureFlagsTableData) {
  return (
    <div className="flex gap-4 flex-wrap">
      <AdminFormAction method="delete" title="Delete flag" body={{ flag }}>
        <DeleteBin2FillIcon />
      </AdminFormAction>

      {dev && prod ? (
        <AdminFormAction
          method="post"
          title="Disable all"
          body={{ flag, dev: false, prod: false }}
        >
          <ToggleOffIcon className="text-danger" />
        </AdminFormAction>
      ) : null}

      {!dev && !prod ? (
        <AdminFormAction
          method="post"
          title="Enable all"
          body={{ flag, dev: true, prod: true }}
        >
          <ToggleOnIcon className="text-success" />
        </AdminFormAction>
      ) : null}
    </div>
  )
}
