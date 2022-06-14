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

  actions?: NavigationLinkProps[]
  navGroups?: AdminNavGroup[]
}

export default function AdminLayout({
  name,
  actions = [],
  navGroups = [],
}: AdminLayoutProps): JSX.Element | null {
  return (
    <div className="grid grid-rows-[3.5rem_1fr] overflow-hidden">
      <header className="px-4 py-2 flex items-center justify-between">
        <Caption>{name}</Caption>
        <div className="flex items-center gap-4">
          {actions?.map((props) => (
            <AdminAction key={props.id} {...props} />
          ))}
        </div>
      </header>
      <div className="grid grid-cols-[18rem_1fr] h-full overflow-hidden border-t border-gray-700">
        <AdminNav groups={navGroups} />
        <main className="overflow-y-scroll max-h-full px-4 p-2 bg-primary">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function AdminAction({ id, to, children, ...props }: NavigationLinkProps) {
  if (!to)
    return (
      <button
        {...props}
        title={id}
        className="hocus:text-primary hocus:underline underline-offset-8"
      >
        {children}
      </button>
    )

  return (
    <NavLink to={to} title={id} {...props}>
      {children}
    </NavLink>
  )
}

export interface AdminNavGroup {
  id: string
  label: string
  children: NavigationLinkProps[]
}

function AdminNav({ groups }: { groups: AdminNavGroup[] }): JSX.Element | null {
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
                  className="text-base w=full hocus:bg-tertiary py-1 px-2 rounded-sm"
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
