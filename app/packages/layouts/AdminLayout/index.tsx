import { Outlet } from "@remix-run/react"
import clsx from "clsx"
import { type ReactNode } from "react"

import type { NavigationLinkProps } from "~/packages/components/Link"

import AdminHeader from "./AdminHeader"
import AdminNav, {
  type AdminNavGroupProps,
  type AdminNavProps,
} from "./AdminNav"

export interface AdminLayoutProps extends AdminNavProps {
  children?: ReactNode
  actions?: NavigationLinkProps[]
  className?: string
  footer?: ReactNode
}

export default function AdminLayout({
  name,
  icon,
  header,
  actions = [],
  navGroups = [],
  children = <Outlet />,
  footer,
  className,
}: AdminLayoutProps): JSX.Element | null {
  const showNav = navGroups.length > 0
  const headerElement = (
    <AdminHeader actions={actions}>{header || name}</AdminHeader>
  )

  return (
    <section
      className={clsx(
        "relative grid overflow-hidden h-full",
        showNav ? "grid-cols-[max-content_1fr]" : "grid-rows-[max-content_1fr]",
      )}
    >
      {showNav ? (
        <AdminNav
          name={name}
          icon={icon}
          navGroups={navGroups}
          header={headerElement}
        />
      ) : (
        headerElement
      )}
      <main className={clsx(className, "relative overflow-y-auto h-full")}>
        {children}
      </main>
      {footer && (
        <footer className="flex items-center min-h-[2.5rem] px-4 border-t border-divider">
          {footer}
        </footer>
      )}
    </section>
  )
}

export { AdminNavGroupProps }

export interface AdminAppProps {
  id: string
  name: string
  icon: ReactNode
}
