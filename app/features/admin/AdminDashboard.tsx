import clsx from "clsx"
import type { ReactNode } from "react"

import Table, { type TableProps } from "../ui/Table"
import { Caption } from "../ui/Text"

export interface AdminDashboardProps {
  children: ReactNode
  icon: ReactNode
  name: string
}

export default function AdminDashboard({
  icon,
  name,
  children,
}: AdminDashboardProps): JSX.Element | null {
  return (
    <div className="flex-center w-full h-full flex-col gap-4 p-4">
      <div className="[&>*]:scale-[2] m-4">{icon}</div>
      <Caption className="w-full pb-4 text-center">{name}</Caption>
      {children}
    </div>
  )
}

AdminDashboard.Table = AdminDashboardTable

function AdminDashboardTable<T extends object>(
  props: TableProps<T>,
): JSX.Element | null {
  return (
    <Table
      {...props}
      orientation="vertical"
      className={clsx(props.className, "border-t border-divider")}
      headCellClassName="px-4 py-2 text-secondary text-base text-left"
      bodyCellClassName="px-4 py-2 min-w-[4rem]  text-left"
      bodyRowClassName="border-b border-divider"
    />
  )
}
