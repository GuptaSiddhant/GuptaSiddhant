import { Link, NavLink, Outlet } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import clsx from "clsx"
import { type ReactNode } from "react"
import AdminIcon from "remixicon-react/AdminFillIcon"
import LogoutIcon from "remixicon-react/LogoutCircleRLineIcon"

import { ErrorSection } from "~/packages/components/Error"
import { CSS_VAR_HEADER_HEIGHT } from "~/packages/constants"
import { authenticateRoute } from "~/packages/service/auth.server"

import { handle as cacheHandle } from "./admin/cache"

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticateRoute(request)
}

export default function AdminIndex(): JSX.Element {
  const adminApps: AdminLinkProps[] = [cacheHandle.adminApp].map((app) => ({
    id: app.id,
    children: app.icon,
    title: app.name,
  }))

  const adminActions: AdminLinkProps[] = [
    { id: "/logout", children: <LogoutIcon />, title: "Logout" },
  ]

  return (
    <section
      id="admin"
      className={clsx(
        "fixed inset-0 h-screen w-screen p-4 ",
        "grid grid-cols-[3rem_1fr]",
      )}
      style={{
        paddingTop: `var(${CSS_VAR_HEADER_HEIGHT})`,
      }}
    >
      <aside className="h-full flex flex-col gap-2 items-center border-r border-divider">
        <NavLink
          to="."
          className="w-full h-12 flex-center border-b border-divider"
        >
          <AdminIcon />
        </NavLink>

        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          {adminApps.map((props) => (
            <AdminLink key={props.id} {...props} />
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-2 justify-end pb-2">
          {adminActions.map((props) => (
            <AdminLink key={props.id} {...props} isAction />
          ))}
        </div>
      </aside>

      <Outlet />
    </section>
  )
}

export interface AdminOutletContent {
  navCollapsed: boolean
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Oops. Admin broke!!!" message={error.message} />
}

interface AdminLinkProps {
  id: string
  children: ReactNode
  title: string
  onClick?: () => void
  isAction?: boolean
}

function AdminLink({
  children,
  id,
  title,
  onClick,
  isAction,
}: AdminLinkProps): JSX.Element | null {
  const style = (props?: { isActive?: boolean; isAction?: boolean }) =>
    clsx(
      props?.isAction ? "p-1 rounded-sm" : "p-2 rounded",
      props?.isActive ? "bg-tertiary" : "bg-secondary hover:bg-tertiary",
    )

  if (onClick) {
    return (
      <button onClick={onClick} className={style({ isAction })} title={title}>
        {children}
      </button>
    )
  }

  if (isAction) {
    return (
      <Link to={id} className={style({ isAction })} title={title}>
        {children}
      </Link>
    )
  }

  return (
    <NavLink to={id} title={title} className={style}>
      {children}
    </NavLink>
  )
}
