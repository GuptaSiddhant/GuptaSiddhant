import Table, { type TableProps } from "@gs/ui/Table"
import { Caption } from "@gs/ui/Text"
import clsx from "clsx"
import type { ReactNode } from "react"

export interface AdminDashboardProps {
  children: ReactNode
  icon: ReactNode
  title: string
}

export default function AdminDashboard({
  icon,
  title,
  children,
}: AdminDashboardProps): JSX.Element | null {
  return (
    <div className="h-full w-full flex-col gap-4 p-4 flex-center">
      <div className="m-4 [&>*]:scale-[2]">{icon}</div>
      <Caption className="w-full pb-4 text-center">{title}</Caption>
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
