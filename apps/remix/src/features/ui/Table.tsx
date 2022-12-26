import clsx from "clsx";
import type { ReactNode } from "react";

import { capitalize } from "@gs/utils/format";

const preservedIds = ["actions"] as const;

export interface TableProps<T extends object> {
  caption?: string;
  data: T[];
  columns: TableColumnProps<T>[];
  orientation?: "horizontal" | "vertical";
  className?: string;
  captionClassName?: string;
  headRowClassName?: string;
  headCellClassName?: string;
  bodyRowClassName?: string;
  bodyCellClassName?: string;
}

export interface TableColumnProps<T extends object> {
  id: keyof T | typeof preservedIds[number];
  headerClassName?: string;
  cellClassName?: string;
  header?: ReactNode | ((data: T[]) => ReactNode);
  cell?: (row: T, data: T[]) => ReactNode;
}

export default function Table<T extends object>(props: TableProps<T>) {
  const { caption, orientation = "horizontal" } = props;
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
  );
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
              key={row.toString() + i}
              className={clsx(props.bodyCellClassName, column.cellClassName)}
            >
              {getCellElement(column, row, data)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function HorizontalTable<T extends object>({
  columns,
  data,
  ...props
}: TableProps<T>) {
  return (
    <>
      <thead>
        <tr className={clsx(props.headRowClassName, "sticky top-0")}>
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
          <tr key={row.toString() + i} className={clsx(props.bodyRowClassName)}>
            {columns.map((column) => (
              <td
                key={column.id.toString()}
                className={clsx(props.bodyCellClassName, column.cellClassName)}
              >
                {getCellElement(column, row, data)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </>
  );
}

function getHeaderElement<T extends object>(
  column: TableColumnProps<T>,
  data: T[],
): React.ReactNode {
  const { id, header } = column;

  return typeof header === "function"
    ? header(data)
    : header ?? capitalize(id.toString());
}

function getCellElement<T extends object>(
  column: TableColumnProps<T>,
  row: T,
  data: T[],
): React.ReactNode {
  const { id, cell } = column;

  // rome-ignore lint/suspicious/noExplicitAny: Complex
  const content: any =
    typeof id === "string" &&
    preservedIds.includes(id as typeof preservedIds[number])
      ? null
      : row?.[id as keyof T] ?? null;

  return cell?.(row, data) ?? content;
}
