import { NavLink, Outlet } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import clsx from "clsx"
import { type ReactNode } from "react"
import AdminIcon from "remixicon-react/AdminFillIcon"
import CacheIcon from "remixicon-react/Database2LineIcon"
import LogoutIcon from "remixicon-react/LogoutCircleRLineIcon"

import { ErrorSection } from "~/packages/components/Error"
import { CSS_VAR_HEADER_HEIGHT } from "~/packages/constants"
import { authenticateRoute } from "~/packages/service/auth.server"

interface AdminApp {
  id: string
  children: ReactNode
  title: string
}

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticateRoute(request)
}

export default function AdminIndex(): JSX.Element {
  const adminApps: AdminApp[] = [
    { id: "cache", children: <CacheIcon />, title: "Cache" },
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
      <aside className=" h-full flex flex-col gap-4 items-center border-r border-gray-700">
        <NavLink to="." className="w-full h-14 flex-center">
          <AdminIcon />
        </NavLink>

        {adminApps.map(({ id, children, title }) => (
          <NavLink
            to={id}
            key={id}
            title={title}
            className={({ isActive }) =>
              clsx(
                "p-2 rounded",
                isActive ? "bg-tertiary" : "bg-secondary hover:bg-tertiary",
              )
            }
          >
            {children}
          </NavLink>
        ))}
      </aside>

      <Outlet />
    </section>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Oops. Admin broke!!!" message={error.message} />
}
