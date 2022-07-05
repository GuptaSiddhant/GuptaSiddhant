import clsx from "clsx"
import { useMemo } from "react"

import {
  CreateIcon,
  DeleteIcon,
  ToggleOffIcon,
  ToggleOnIcon,
} from "~/features/icons"
import {
  type FeatureFlagJson,
  type FeatureFlagsMap,
} from "~/features/service/feature-flag.server"
import FormAction from "~/features/ui/FormAction"
import Input from "~/features/ui/Input"
import { getDeleteConfirmProps } from "~/features/ui/Popover/Confirm"
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
      className="h-max w-full flex-1"
      data={tableData}
      columns={tableColumns}
      bodyRowClassName={clsx("border-b border-divider")}
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
      <label className="flex items-center gap-1">
        <input type="checkbox" name={dev ? "dev" : "prod"} form={FORM_ID} />
        <span className="text-base text-tertiary">Enable?</span>
      </label>
    )
  }

  const value: boolean = dev ? row.dev : row.prod

  return (
    <div className="flex">
      <FormAction
        method="patch"
        title="Toggle flag"
        body={{ ...row, [dev ? "dev" : "prod"]: !value }}
      >
        <span
          className={clsx(
            "font-monospace text-sm",
            value ? "text-positive" : "text-negative",
          )}
        >
          {value ? "enabled" : "disabled"}
        </span>
      </FormAction>
    </div>
  )
}

function ActionCell({ flag, dev, prod }: FeatureFlagsTableData) {
  const buttonClassName = clsx(
    "shadow-md border border-divider rounded p-1 bg-secondary hocus:bg-tertiary",
  )

  if (!flag) {
    return (
      <div className="flex flex-wrap gap-4">
        <FormAction
          id={FORM_ID}
          method="post"
          title="Create flag"
          body={{ flag, dev, prod }}
          className={clsx(buttonClassName, "pr-2 text-base")}
        >
          <CreateIcon />
          <span>Add</span>
        </FormAction>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <FormAction
        method="delete"
        title="Delete flag"
        body={{ flag }}
        className={buttonClassName}
        confirm={getDeleteConfirmProps("flag")}
      >
        <DeleteIcon className="text-negative" />
      </FormAction>

      {dev && prod ? (
        <FormAction
          method="patch"
          title="Disable all"
          body={{ flag, dev: false, prod: false }}
          className={buttonClassName}
        >
          <ToggleOffIcon className="text-negative" />
        </FormAction>
      ) : null}

      {!dev && !prod ? (
        <FormAction
          method="patch"
          title="Enable all"
          body={{ flag, dev: true, prod: true }}
          className={buttonClassName}
        >
          <ToggleOnIcon className="text-positive" />
        </FormAction>
      ) : null}
    </div>
  )
}
