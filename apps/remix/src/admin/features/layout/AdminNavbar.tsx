import clsx from "clsx";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import CollapseSidebarIcon from "remixicon-react/ArrowLeftSLineIcon";
import ExpandSidebarIcon from "remixicon-react/ArrowRightSLineIcon";

import { NavLink, useLocation } from "@remix-run/react";

import useMediaQuery from "@gs/hooks/useMediaQuery";
import type { NavigationLinkProps } from "@gs/types";
import type { To } from "@gs/types";
import Accordion from "@gs/ui/Accordion";

import AdminHeader from "./AdminHeader";

export interface AdminNavbarProps {
  title?: string;
  icon?: ReactNode;
  navGroups?: AdminNavbarGroupProps[];
  header?: ReactNode;
  actions?: NavigationLinkProps[];
  to?: To;
  filterPlaceholder?: string;
}

export default function AdminNavbar({
  navGroups = [],
  header,
  title,
  icon,
  actions,
  to,
  filterPlaceholder,
}: AdminNavbarProps): JSX.Element | null {
  const [navCollapsed, setNavCollapsed] = useState(false);

  const isMobileWidth = useMediaQuery("(max-width: 768px)");
  useEffect(() => setNavCollapsed(isMobileWidth), [isMobileWidth]);

  const [filterTerm, setFilterTerm] = useState("");
  const filteredNavGroups = useMemo(
    () =>
      filterTerm
        ? navGroups.map((group) => ({
            ...group,
            children: group.children.filter(({ id, children }) => {
              if (typeof children === "string") {
                return children.toLowerCase().includes(filterTerm);
              }

              return id.toLowerCase().includes(filterTerm);
            }),
          }))
        : navGroups,
    [navGroups, filterTerm],
  );

  if (navGroups.length === 0) {
    return null;
  }

  return (
    <aside
      className={clsx(
        "relative h-full overflow-hidden border-r border-divider",
        "flex flex-col justify-between",
        "transition-[width]",
        navCollapsed ? "w-12" : "w-72",
      )}
    >
      <AdminHeader
        actions={actions}
        collapsed={navCollapsed}
        icon={icon}
        to={to}
      >
        {header}
      </AdminHeader>

      {filteredNavGroups.length > 0 ? (
        <nav
          className={clsx(
            "h-full flex-1 overflow-y-auto",
            "flex list-none flex-col items-start gap-2",
            "transition-opacity",
            navCollapsed ? "invisible opacity-0" : "visible opacity-100",
          )}
        >
          {filteredNavGroups.map((group) => (
            <AdminNavbarGroup key={group.id} {...group} />
          ))}
        </nav>
      ) : (
        <div className="text-sm text-disabled flex-center">
          No matching results found
        </div>
      )}
      <AdminNavFooter
        placeholder={filterPlaceholder || `Filter ${title}`}
        navCollapsed={navCollapsed}
        setFilterTerm={setFilterTerm}
        setNavCollapsed={setNavCollapsed}
      />
    </aside>
  );
}

function AdminNavFooter({
  placeholder = "Filter nav items",
  navCollapsed,
  setFilterTerm,
  setNavCollapsed,
}: {
  placeholder?: string;
  navCollapsed: boolean;
  setNavCollapsed: Dispatch<SetStateAction<boolean>>;
  setFilterTerm: Dispatch<SetStateAction<string>>;
}): JSX.Element | null {
  return (
    <footer
      className={clsx(
        "flex min-h-[2.5rem] items-center gap-2 border-t border-divider px-2",
        navCollapsed ? "justify-center" : "justify-between",
      )}
    >
      {navCollapsed ? null : (
        <input
          type="search"
          placeholder={placeholder}
          onChange={(e) => setFilterTerm(e.currentTarget.value?.trim() || "")}
          className={clsx("flex-1 rounded bg-default px-2 py-1 text-base")}
        />
      )}

      <button
        onClick={() => setNavCollapsed((current) => !current)}
        type="button"
      >
        {navCollapsed ? <ExpandSidebarIcon /> : <CollapseSidebarIcon />}
        <span className="sr-only">
          {navCollapsed ? "Expand navbar" : "Collapse navbar"}
        </span>
      </button>
    </footer>
  );
}

export interface AdminNavbarGroupProps {
  id: string;
  label: string;
  showCount?: boolean;
  openByDefault?: boolean;
  children: NavigationLinkProps[];
  actions?: React.ReactNode;
}

function AdminNavbarGroup({
  id,
  children,
  label,
  showCount = false,
  openByDefault,
  actions,
}: AdminNavbarGroupProps): JSX.Element | null {
  const { pathname } = useLocation();
  const isPathnameMatch = pathname.includes(id);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    isPathnameMatch && ref.current?.focus();
  }, [isPathnameMatch]);

  if (children.length === 0) {
    return null;
  }

  return (
    <Accordion
      summaryRef={ref}
      open={openByDefault ?? isPathnameMatch}
      summary={label}
      summaryClassName={clsx("sticky top-0 sm:rounded-none")}
      summaryLeadingElement={
        <>
          {showCount ? (
            <span className="font-normal">({children.length})</span>
          ) : null}
          {actions}
        </>
      }
    >
      <ul className="flex list-none flex-col gap-1 px-2">
        {children.map((link) => (
          <AdminNavbarItem key={link.id} {...link} />
        ))}
      </ul>
    </Accordion>
  );
}

function AdminNavbarItem({
  children,
  id,
  onClick,
  to,
}: NavigationLinkProps): JSX.Element | null {
  if (!(to || onClick)) {
    return null;
  }

  return (
    <NavLink
      id={id}
      to={to!}
      onClick={onClick}
      prefetch="intent"
      className={({ isActive }) =>
        clsx(
          "w=full rounded-sm py-1 px-2 text-base hocus:bg-tertiary",
          isActive && "bg-tertiary",
        )
      }
    >
      <li>{children}</li>
    </NavLink>
  );
}
