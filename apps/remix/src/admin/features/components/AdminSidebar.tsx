import clsx from "clsx";

import { Link, NavLink } from "@remix-run/react";

import { Caption } from "@gs/ui/Text";

import { AdminIcon } from "../index";

export interface AdminSidebarProps {
  apps: AdminLinkProps[];
  actions: AdminLinkProps[];
  isChildPathVisible: boolean;
}

export default function AdminSidebar({
  apps,
  actions,
  isChildPathVisible,
}: AdminSidebarProps): JSX.Element | null {
  return (
    <aside
      className={clsx(
        "absolute inset-0 flex flex-col gap-2 border-divider transition-[width]",
        isChildPathVisible
          ? "w-12 items-center border-r"
          : "-w-screen-m4 sm:w-80 sm:border-r",
      )}
    >
      <NavLink
        to="."
        className={clsx(
          "h-12 w-full gap-4 border-b border-divider bg-secondary",
          isChildPathVisible ? "flex-center" : "flex items-center px-6",
        )}
      >
        <AdminIcon /> {isChildPathVisible ? null : <Caption>GS Admin</Caption>}
      </NavLink>

      {apps.length > 0 ? (
        <div
          className={clsx(
            "flex flex-1 flex-col gap-2 overflow-auto min-h-0 ",
            isChildPathVisible ? "" : "px-2",
          )}
        >
          {apps.map((props) => (
            <AdminAppLink
              key={props.id}
              isCollapsed={isChildPathVisible}
              {...props}
            />
          ))}
        </div>
      ) : null}

      {actions.length > 0 ? (
        <div
          className={clsx(
            "flex h-max min-h-[2.5rem] w-full gap-2 border-t border-divider",
            isChildPathVisible
              ? "flex-col justify-end px-0 py-0 sm:py-1"
              : "flex-row flex-wrap p-2",
          )}
        >
          {actions.map((props) => (
            <AdminAction
              key={props.id}
              isCollapsed={isChildPathVisible}
              {...props}
            />
          ))}
        </div>
      ) : null}
    </aside>
  );
}

export interface AdminLinkProps {
  id: string;
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
  isCollapsed?: boolean;
  linkPath?: string;
}

function AdminAppLink({
  children,
  id,
  title,
  onClick,
  isCollapsed,
}: AdminLinkProps): JSX.Element | null {
  const style = (props?: { isActive?: boolean }) =>
    clsx(
      "flex gap-4 items-center py-2 rounded",
      isCollapsed ? "px-2" : "px-4",
      props?.isActive
        ? "bg-tertiary border border-divider"
        : "bg-secondary hover:bg-tertiary",
    );

  const nameElement = isCollapsed ? null : <strong>{title}</strong>;

  return (
    <NavLink to={id} title={title} className={style} onClick={onClick}>
      {children} {nameElement}
    </NavLink>
  );
}

function AdminAction({
  children,
  id,
  title,
  onClick,
  isCollapsed,
  linkPath,
}: AdminLinkProps): JSX.Element | null {
  const styleClassName = clsx(
    "flex flex-1 gap-2 items-center py-1 rounded-sm",
    "bg-secondary text-secondary hocus:bg-tertiary hocus:text-primary",
    isCollapsed ? "px-1 mx-auto w-max" : "px-2",
  );

  const nameElement = isCollapsed ? null : <span>{title}</span>;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={styleClassName}
        title={title}
        type="button"
      >
        {children} {nameElement}
      </button>
    );
  }

  return (
    <Link to={linkPath || id} className={styleClassName} title={title}>
      {children} {nameElement}
    </Link>
  );
}
