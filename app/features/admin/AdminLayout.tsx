import { Outlet } from "@remix-run/react"
import clsx from "clsx"
import { type ReactNode } from "react"

import AdminHeader from "./AdminHeader"
import AdminNavbar, { type AdminNavbarProps } from "./AdminNavbar"

export interface AdminLayoutProps extends AdminNavbarProps {
  children?: ReactNode
  className?: string
  footer?: ReactNode
}

export default function AdminLayout({
  name,
  icon,
  header = name,
  actions = [],
  className,
  children = <Outlet />,
  footer,
  to,
  ...props
}: AdminLayoutProps): JSX.Element | null {
  const isRenderNavbar = (props.navGroups?.length || 0) > 0

  return (
    <section
      className={clsx(
        "relative grid overflow-hidden h-full animate-appear-rtl",
        isRenderNavbar
          ? "grid-cols-[max-content_1fr]"
          : "grid-rows-[max-content_1fr]",
      )}
    >
      {isRenderNavbar ? (
        <AdminNavbar
          name={name}
          icon={icon}
          header={header}
          actions={actions}
          to={to}
          {...props}
        />
      ) : (
        <AdminHeader actions={actions} icon={icon} to={to}>
          {header}
        </AdminHeader>
      )}
      <main className={clsx(className, "relative overflow-y-auto h-full")}>
        {children}
      </main>
      {footer && (
        <footer
          className={clsx(
            "flex items-center min-h-[2.5rem] px-4 border-t border-divider justify-between",
            isRenderNavbar && "col-span-2",
          )}
        >
          {footer}
        </footer>
      )}
    </section>
  )
}