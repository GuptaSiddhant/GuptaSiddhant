import clsx from "clsx"
import { useMemo } from "react"
import CreateIcon from "remixicon-react/AddLineIcon"
import DeleteBin2FillIcon from "remixicon-react/DeleteBin2LineIcon"
import ToggleOnIcon from "remixicon-react/ToggleFillIcon"
import ToggleOffIcon from "remixicon-react/ToggleLineIcon"

import AdminFormAction from "~/features/admin/AdminFormAction"
import {
  type FeatureFlagJson,
  type FeatureFlagsMap,
} from "~/features/service/remote-config.server"
import Input from "~/features/ui/Input"
import Table, { type TableColumnProps } from "~/features/ui/Table"

const FORM_ID = "new-flag"

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
    () => [
      {
        flag: "",
        dev: false,
        prod: false,
      },
      ...Object.entries(featureFlags).map(([flag, { dev, prod }]) => ({
        flag,
        dev,
        prod,
      })),
    ],
    [featureFlags],
  )

  const tableColumns: TableColumnProps<FeatureFlagsTableData>[] = useMemo(
    () => [
      {
        id: "flag",
        header: "Flag key",
        cell: ({ flag }, data) => (
          <FlagKeyCell
            flag={flag}
            currentFlags={data.map(({ flag }) => flag)}
          />
        ),
      },
      {
        id: "dev",
        cell: (row) => <ToggleCell row={row} dev />,
      },
      {
        id: "prod",
        cell: (row) => <ToggleCell row={row} />,
      },
      {
        id: "actions",
        cell: (row) => <ActionCell {...row} />,
      },
    ],
    [],
  )

  return (
    <Table
      className="flex-1 w-full h-max"
      data={tableData}
      columns={tableColumns}
      bodyRowClassName={clsx("border-b border-divider/50")}
      bodyCellClassName="px-4 py-2 min-w-[4rem]  text-left"
      headRowClassName="border-b border-divider bg-default"
      headCellClassName="px-4 py-2 text-secondary text-sm text-left border-r border-divider"
    />
  )
}

function FlagKeyCell({
  flag,
  currentFlags,
}: {
  flag: string
  currentFlags: string[]
}) {
  if (flag) return <span className="font-monospace text-sm">{flag}</span>

  return (
    <Input
      type="text"
      placeholder="New feature flag key"
      name="flag"
      form={FORM_ID}
      required
      className="w-full font-monospace text-sm"
      datalist={currentFlags}
      autoComplete="off"
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
  if (!row.flag) {
    return (
      <label className="flex gap-1 items-center">
        <input type="checkbox" name={dev ? "dev" : "prod"} form={FORM_ID} />
        <span className="text-tertiary text-base">Enable?</span>
      </label>
    )
  }

  const value: boolean = dev ? row.dev : row.prod

  return (
    <div className="flex">
      <AdminFormAction
        method="patch"
        title="Toggle flag"
        body={{ ...row, [dev ? "dev" : "prod"]: !value }}
      >
        <span
          className={clsx(
            "font-monospace text-sm",
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
  const buttonClassName = clsx(
    "shadow-md border border-divider rounded p-1 bg-secondary hocus:bg-tertiary",
  )

  if (!flag) {
    return (
      <div className="flex gap-4 flex-wrap">
        <AdminFormAction
          id={FORM_ID}
          method="post"
          title="Create flag"
          body={{ flag, dev, prod }}
          className={clsx(buttonClassName, "pr-2 text-base")}
        >
          <CreateIcon />
          <span>Add</span>
        </AdminFormAction>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <AdminFormAction
        method="delete"
        title="Delete flag"
        body={{ flag }}
        className={buttonClassName}
      >
        <DeleteBin2FillIcon className="text-danger" />
      </AdminFormAction>

      {dev && prod ? (
        <AdminFormAction
          method="patch"
          title="Disable all"
          body={{ flag, dev: false, prod: false }}
          className={buttonClassName}
        >
          <ToggleOffIcon className="text-danger" />
        </AdminFormAction>
      ) : null}

      {!dev && !prod ? (
        <AdminFormAction
          method="patch"
          title="Enable all"
          body={{ flag, dev: true, prod: true }}
          className={buttonClassName}
        >
          <ToggleOnIcon className="text-success" />
        </AdminFormAction>
      ) : null}
    </div>
  )
}
