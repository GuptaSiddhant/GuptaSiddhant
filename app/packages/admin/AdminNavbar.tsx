import { NavLink } from "@remix-run/react"
import clsx from "clsx"
import type { Dispatch, ReactNode, SetStateAction } from "react"
import { useMemo } from "react"
import { useState } from "react"
import CollapseSidebarIcon from "remixicon-react/ArrowLeftSLineIcon"
import ExpandSidebarIcon from "remixicon-react/ArrowRightSLineIcon"

import Accordion from "~/packages/components/Accordion"
import type { NavigationLinkProps } from "~/packages/components/Link"

import AdminHeader from "./AdminHeader"
import useAdminContext from "./context"

export interface AdminNavbarProps {
  name?: string
  icon?: ReactNode
  navGroups?: AdminNavbarGroupProps[]
  header?: ReactNode
  actions?: NavigationLinkProps[]
}

export default function AdminNavbar({
  navGroups = [],
  header,
  name,
  icon,
  actions,
}: AdminNavbarProps): JSX.Element | null {
  const { defaultNavbarCollapsed } = useAdminContext()
  const [navCollapsed, setNavCollapsed] = useState(
    Boolean(defaultNavbarCollapsed),
  )
  const [filterTerm, setFilterTerm] = useState("")
  const filteredNavGroups = useMemo(
    () =>
      filterTerm
        ? navGroups.map((group) => ({
            ...group,
            children: group.children.filter((item) =>
              item.children?.toString().includes(filterTerm),
            ),
          }))
        : navGroups,
    [navGroups, filterTerm],
  )

  if (navGroups.length === 0) return null

  return (
    <aside
      className={clsx(
        "relative overflow-hidden h-full border-r border-divider",
        "flex flex-col justify-between",
        "transition-[width]",
        navCollapsed ? "w-12" : "w-72",
      )}
    >
      <AdminHeader actions={actions} collapsed={navCollapsed} icon={icon}>
        {header}
      </AdminHeader>

      {filteredNavGroups.length > 0 ? (
        <nav
          className={clsx(
            "flex-1 overflow-y-auto h-full",
            "flex flex-col items-start gap-2 list-none",
            "transition-opacity",
            navCollapsed ? "invisible opacity-0" : "visible opacity-100",
          )}
        >
          {filteredNavGroups.map((group) => (
            <AdminNavbarGroup key={group.id} {...group} />
          ))}
        </nav>
      ) : (
        <div className="flex-center text-disabled text-sm">
          No matching results found
        </div>
      )}
      <AdminNavFooter
        placeholder={`Filter ${name}`}
        navCollapsed={navCollapsed}
        setFilterTerm={setFilterTerm}
        setNavCollapsed={setNavCollapsed}
      />
    </aside>
  )
}

function AdminNavFooter({
  placeholder = "Filter nav items",
  navCollapsed,
  setFilterTerm,
  setNavCollapsed,
}: {
  placeholder?: string
  navCollapsed: boolean
  setNavCollapsed: Dispatch<SetStateAction<boolean>>
  setFilterTerm: Dispatch<SetStateAction<string>>
}): JSX.Element | null {
  return (
    <footer
      className={clsx(
        "flex items-center min-h-[2.5rem] px-2 border-t border-divider gap-2",
        navCollapsed ? "justify-center" : "justify-between",
      )}
    >
      {navCollapsed ? null : (
        <input
          type="search"
          placeholder={placeholder}
          onChange={(e) => setFilterTerm(e.currentTarget.value?.trim() || "")}
          className={clsx("bg-default flex-1 rounded px-2 py-1 text-base")}
        />
      )}

      <button onClick={() => setNavCollapsed((current) => !current)}>
        {navCollapsed ? <ExpandSidebarIcon /> : <CollapseSidebarIcon />}
        <span className="sr-only">
          {navCollapsed ? "Expand navbar" : "Collapse navbar"}
        </span>
      </button>
    </footer>
  )
}

export interface AdminNavbarGroupProps {
  id: string
  label: string
  children: NavigationLinkProps[]
}

function AdminNavbarGroup({
  children,
  label,
}: AdminNavbarGroupProps): JSX.Element | null {
  if (children.length === 0) return null

  return (
    <Accordion
      open
      summary={
        <div className="flex justify-between items-baseline">
          <span>{label}</span>
          <span className="font-normal">({children.length})</span>
        </div>
      }
      summaryClassName="sticky top-0"
    >
      <ul className="flex flex-col gap-1 list-none px-2">
        {children.map((link) => (
          <AdminNavbarItem key={link.id} {...link} />
        ))}
      </ul>
    </Accordion>
  )
}

function AdminNavbarItem({
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
