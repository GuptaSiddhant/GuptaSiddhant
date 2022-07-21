import clsx from "clsx"
import { type ReactNode, useEffect, useRef } from "react"

import { Outlet } from "@remix-run/react"

import AdminHeader from "./AdminHeader"
import AdminNavbar, { type AdminNavbarProps } from "./AdminNavbar"

export interface AdminLayoutProps extends AdminNavbarProps {
  children?: ReactNode
  className?: string
  footer?: ReactNode
  sectionClassName?: string
}

export default function AdminLayout({
  title,
  icon,
  header = <strong>{title}</strong>,
  actions = [],
  className,
  children = <Outlet />,
  footer,
  to,
  sectionClassName,
  ...props
}: AdminLayoutProps): JSX.Element | null {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isRenderNavbar = (props.navGroups?.length || 0) > 0

  useEffect(() => sectionRef.current?.scrollIntoView(), [])

  return (
    <section
      ref={sectionRef}
      className={clsx(
        sectionClassName,
        "relative grid h-full animate-appear-rtl overflow-hidden",
        isRenderNavbar
          ? "grid-cols-[max-content_1fr] grid-rows-[1fr_max-content]"
          : "grid-rows-[max-content_1fr]",
      )}
    >
      {isRenderNavbar ? (
        <AdminNavbar
          title={title}
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
      <main className={clsx(className, "relative h-full overflow-y-auto")}>
        {children}
      </main>
      {footer && (
        <footer
          className={clsx(
            "flex min-h-[2.5rem] items-center justify-between border-t border-divider px-4",
            isRenderNavbar && "col-span-2",
          )}
        >
          {footer}
        </footer>
      )}
    </section>
  )
}
