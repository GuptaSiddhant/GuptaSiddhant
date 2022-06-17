import clsx from "clsx"
import type { ReactNode } from "react"

import { capitalize } from "../helpers/format"

export interface TableProps<T extends object> {
  caption?: string
  data: T[]
  columns: {
    id: keyof T
    header?: ReactNode
    cell?: (content: T[keyof T]) => ReactNode
  }[]
  orientation?: "horizontal" | "vertical"
  className?: string
  captionClassName?: string
  headRowClassName?: string
  headCellClassName?: string
  bodyRowClassName?: string
  bodyCellClassName?: string
}

export default function Table<T extends object>(props: TableProps<T>) {
  const { caption, orientation = "horizontal" } = props
  return (
    <table className={clsx(props.className, "table-fixed border-collapse")}>
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
      {columns.map(({ header, id, cell }) => (
        <tr key={id.toString()} className={clsx(props.bodyRowClassName)}>
          <th className={clsx(props.headCellClassName)}>
            {header || capitalize(id.toString())}
          </th>
          {data.map((row, i) => (
            <td key={i} className={clsx(props.bodyCellClassName)}>
              {cell?.(row[id]) || row[id]}
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
          {columns.map(({ id, header }) => (
            <th key={id.toString()} className={clsx(props.headCellClassName)}>
              {header || capitalize(id.toString())}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className={clsx(props.bodyRowClassName)}>
            {columns.map(({ id, cell }) => (
              <td key={id.toString()} className={clsx(props.bodyCellClassName)}>
                {cell?.(row[id]) || row[id]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </>
  )
}
