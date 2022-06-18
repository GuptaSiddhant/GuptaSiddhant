import clsx from "clsx"
import type { ReactNode } from "react"

import { capitalize } from "../helpers/format"

const preservedIds = ["actions"] as const

export interface TableProps<T extends object> {
  caption?: string
  data: T[]
  columns: TableColumnProps<T>[]
  orientation?: "horizontal" | "vertical"
  className?: string
  captionClassName?: string
  headRowClassName?: string
  headCellClassName?: string
  bodyRowClassName?: string
  bodyCellClassName?: string
}

export interface TableColumnProps<T extends object> {
  id: keyof T | typeof preservedIds[number]
  headerClassName?: string
  cellClassName?: string
  header?: ReactNode | ((data: T[]) => ReactNode)
  cell?: (content: T[keyof T] | undefined, row: T) => ReactNode
}

export default function Table<T extends object>(props: TableProps<T>) {
  const { caption, orientation = "horizontal" } = props
  return (
    <table className={clsx(props.className, "border-collapse")}>
      <caption
        className={clsx(props.captionClassName, "text-sm text-tertiary")}
      >
        {caption}
      </caption>

      {orientation === "vertical" ? (
        <VerticalTable {...props} />
      ) : (
        <HorizontalTable {...props} />
      )}
    </table>
  )
}

function VerticalTable<T extends object>({
  columns,
  data,
  ...props
}: TableProps<T>) {
  return (
    <tbody>
      {columns.map((column) => (
        <tr key={column.id.toString()} className={clsx(props.bodyRowClassName)}>
          <th className={clsx(props.headCellClassName, column.headerClassName)}>
            {getHeaderElement(column, data)}
          </th>
          {data.map((row, i) => (
            <td
              key={i}
              className={clsx(props.bodyCellClassName, column.cellClassName)}
            >
              {getCellElement(column, row)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

function HorizontalTable<T extends object>({
  columns,
  data,
  ...props
}: TableProps<T>) {
  return (
    <>
      <thead>
        <tr className={clsx(props.headRowClassName)}>
          {columns.map((column) => (
            <th
              key={column.id.toString()}
              className={clsx(props.headCellClassName, column.headerClassName)}
            >
              {getHeaderElement(column, data)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className={clsx(props.bodyRowClassName)}>
            {columns.map((column) => (
              <td
                key={column.id.toString()}
                className={clsx(props.bodyCellClassName, column.cellClassName)}
              >
                {getCellElement(column, row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </>
  )
}

function getHeaderElement<T extends object>(
  column: TableColumnProps<T>,
  data: T[],
) {
  const { id, header } = column

  return typeof header === "function"
    ? header(data)
    : header ?? capitalize(id.toString())
}

function getCellElement<T extends object>(column: TableColumnProps<T>, row: T) {
  const { id, cell } = column

  const content =
    typeof id === "string" &&
    preservedIds.includes(id as typeof preservedIds[number])
      ? undefined
      : row?.[id as keyof T] ?? undefined

  return cell?.(content, row) || content
}
