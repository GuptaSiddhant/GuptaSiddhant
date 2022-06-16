import { NavLink } from "@remix-run/react"
import clsx from "clsx"
import type { Dispatch, ReactNode, SetStateAction } from "react"
import { createContext, useContext, useState } from "react"
import CollapseSidebarIcon from "remixicon-react/ArrowLeftSLineIcon"
import ExpandSidebarIcon from "remixicon-react/ArrowRightSLineIcon"

import type { NavigationLinkProps } from "~/packages/components/Link"

const AdminNavContext = createContext<
  | undefined
  | {
      navCollapsed: boolean
      setNavCollapsed: Dispatch<SetStateAction<boolean>>
      setFilterTerm: Dispatch<SetStateAction<string>>
    }
>(undefined)

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
  const [filterTerm, setFilterTerm] = useState("")
  const filteredNavGroups = filterTerm
    ? navGroups
        .filter(({ label, children }) => {
          if (label.includes(filterTerm)) return true
          if (children && children.length > 0) {
            return children.some((item) =>
              item.children?.toString().includes(filterTerm),
            )
          }
          return false
        })
        .map((group) => ({
          ...group,
          children: group.children.filter((item) =>
            item.children?.toString().includes(filterTerm),
          ),
        }))
    : navGroups

  if (navGroups.length === 0) return null

  return (
    <AdminNavContext.Provider
      value={{ navCollapsed, setNavCollapsed, setFilterTerm }}
    >
      <aside
        className={clsx(
          "relative overflow-hidden h-full border-r border-divider",
          "flex flex-col justify-between",
          "transition-[width]",
          navCollapsed ? "w-10" : "w-72",
        )}
      >
        {navCollapsed ? (
          <header
            className="w-full h-12 flex-center border-b border-divider"
            title={name}
          >
            {icon}
          </header>
        ) : (
          header
        )}

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
              <AdminNavGroup key={group.id} {...group} />
            ))}
          </nav>
        ) : (
          <div className="flex-center text-disabled text-sm">
            No matching results found
          </div>
        )}
        <AdminNavFooter />
      </aside>
    </AdminNavContext.Provider>
  )
}

function AdminNavFooter(): JSX.Element | null {
  const { navCollapsed, setNavCollapsed, setFilterTerm } = useAdminNavContext()

  return (
    <footer className="flex items-center min-h-[2.5rem] px-2 border-t border-divider justify-between gap-2">
      {navCollapsed ? null : (
        <input
          type="search"
          placeholder="Filter nav items"
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

//

function useAdminNavContext() {
  const context = useContext(AdminNavContext)
  if (!context)
    throw new Error("useAdminNavContext must be used within a AdminNavContext")

  return context
}
