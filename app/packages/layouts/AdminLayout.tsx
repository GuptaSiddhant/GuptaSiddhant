import { NavLink, Outlet } from "@remix-run/react"
import clsx from "clsx"
import { type ReactNode } from "react"

import type { To } from "../components/Link"
import { Caption } from "../components/Text"

export interface NavigationLinkProps {
  id: string
  children: ReactNode
  to?: To
  onClick?: () => void
}

export interface AdminLayoutProps {
  name: string
  children?: ReactNode
  actions?: NavigationLinkProps[]
  navGroups?: AdminNavGroup[]
  className?: string
}

export default function AdminLayout({
  name,
  actions = [],
  navGroups = [],
  children = <Outlet />,
  className,
}: AdminLayoutProps): JSX.Element | null {
  return (
    <div className="relative grid grid-rows-[3.5rem_1fr] overflow-hidden">
      <AdminHeader actions={actions}>{name}</AdminHeader>

      <div
        className={clsx(
          "grid h-full overflow-hidden",
          navGroups.length > 0 ? "grid-cols-[18rem_1fr]" : "grid-cols-1",
        )}
      >
        <AdminNav groups={navGroups} />
        <main
          className={clsx(
            className,
            "relative",
            "overflow-y-auto",
            "h-full max-h-screen-main",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

AdminLayout.Header = AdminHeader
AdminLayout.Action = AdminAction

function AdminHeader({
  children,
  actions,
}: {
  children: ReactNode
  actions?: NavigationLinkProps[]
}): JSX.Element {
  return (
    <header className="sticky top-0 px-4 py-2 grid items-center grid-cols-[1fr_max-content] border-b border-gray-700">
      <Caption className="text-ellipsis whitespace-nowrap overflow-hidden">
        {children}
      </Caption>
      <div className="flex items-center gap-4">
        {actions?.map((props) => (
          <AdminAction key={props.id} {...props} />
        ))}
      </div>
    </header>
  )
}

function AdminAction({
  id,
  to,
  children,
  ...props
}: NavigationLinkProps): JSX.Element | null {
  if (props.onClick) {
    return (
      <button
        {...props}
        title={id}
        className="hocus:text-primary hocus:underline underline-offset-8"
      >
        {children}
      </button>
    )
  }

  if (to) {
    return (
      <NavLink to={to} title={id} {...props}>
        {children}
      </NavLink>
    )
  }

  return <>{children}</>
}

export interface AdminNavGroup {
  id: string
  label: string
  children: NavigationLinkProps[]
}

function AdminNav({ groups }: { groups: AdminNavGroup[] }): JSX.Element | null {
  if (groups.length === 0) return null

  return (
    <nav
      className={clsx(
        "overflow-y-auto h-full border-r border-gray-700",
        "flex flex-col items-start gap-2 list-none",
      )}
    >
      {groups.map(({ children, id, label }) =>
        children.length > 0 ? (
          <details key={id} open className="relative w-full">
            <summary className="sticky top-0 py-2 px-4 bg-default font-bold text-sm rounded">
              {label.toUpperCase().replace(/-/g, " ")}
            </summary>
            <ul className="flex flex-col gap-2 list-none px-2 ">
              {children.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.to!}
                  className={({ isActive }) =>
                    clsx(
                      "text-base w=full hocus:bg-tertiary py-1 px-2 rounded-sm",
                      isActive && "bg-tertiary",
                    )
                  }
                >
                  <li>{link.children}</li>
                </NavLink>
              ))}
            </ul>
          </details>
        ) : null,
      )}
    </nav>
  )
}
