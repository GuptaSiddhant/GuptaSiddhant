import { NavLink } from "@remix-run/react"
import clsx from "clsx"
import { type ReactNode, useState } from "react"
import CollapseSidebarIcon from "remixicon-react/ArrowLeftSLineIcon"
import ExpandSidebarIcon from "remixicon-react/ArrowRightSLineIcon"

import type { NavigationLinkProps } from "~/packages/components/Link"

export interface AdminNavProps {
  name?: string
  icon?: ReactNode
  navGroups: AdminNavGroupProps[]
  header?: ReactNode
}

export default function AdminNav({
  navGroups,
  header,
  name,
  icon,
}: AdminNavProps): JSX.Element | null {
  const [navCollapsed, setNavCollapsed] = useState(false)

  if (navGroups.length === 0) return null

  return (
    <aside
      className={clsx(
        "relative overflow-hidden h-full border-r border-divider",
        "flex flex-col justify-between",
        "transition-[width]",
        navCollapsed ? "w-10" : "w-72",
      )}
    >
      {navCollapsed ? (
        icon ? (
          <header className="w-full h-12 flex-center border-b border-divider">
            {icon}
          </header>
        ) : (
          <header className="absolute top-4 -rotate-90 origin-bottom font-bold uppercase tracking-wider">
            {name}
          </header>
        )
      ) : (
        header
      )}

      <nav
        className={clsx(
          "flex-1 overflow-y-auto h-full",
          "flex flex-col items-start gap-2 list-none",
          "transition-opacity",
          navCollapsed ? "invisible opacity-0" : "visible opacity-100",
        )}
      >
        {navGroups.map((group) => (
          <AdminNavGroup key={group.id} {...group} />
        ))}
      </nav>
      <footer className="flex items-center p-2 border-t border-divider justify-end">
        <button onClick={() => setNavCollapsed((current) => !current)}>
          {navCollapsed ? <ExpandSidebarIcon /> : <CollapseSidebarIcon />}
          <span className="sr-only">
            {navCollapsed ? "Expand navbar" : "Collapse navbar"}
          </span>
        </button>
      </footer>
    </aside>
  )
}

export interface AdminNavGroupProps {
  id: string
  label: string
  children: NavigationLinkProps[]
}

function AdminNavGroup({
  children,
  label,
}: AdminNavGroupProps): JSX.Element | null {
  if (children.length === 0) return null

  return (
    <details open className="relative w-full">
      <summary className="sticky top-0 py-2 px-4 mb-1 bg-default font-bold text-sm rounded select-none cursor-pointer">
        {label.toUpperCase().replace(/-/g, " ")}
      </summary>
      <ul className="flex flex-col gap-1 list-none px-2 ">
        {children.map((link) => (
          <AdminNavItem key={link.id} {...link} />
        ))}
      </ul>
    </details>
  )
}

function AdminNavItem({
  children,
  id,
  onClick,
  to,
}: NavigationLinkProps): JSX.Element | null {
  return (
    <NavLink
      id={id}
      to={to!}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          "text-base w=full hocus:bg-tertiary py-1 px-2 rounded-sm",
          isActive && "bg-tertiary",
        )
      }
    >
      <li>{children}</li>
    </NavLink>
  )
}
