import { NavLink, Outlet, useLoaderData } from "@remix-run/react"
import { type LoaderFunction, json } from "@remix-run/server-runtime"
import clsx from "clsx"
import AdminIcon from "remixicon-react/AdminFillIcon"
import LogoutIcon from "remixicon-react/LogoutCircleRLineIcon"

import AdminLink, { type AdminLinkProps } from "~/features/admin/AdminLink"
import { AdminContext } from "~/features/admin/context"
import { CSS_VAR_HEADER_HEIGHT } from "~/features/constants"
import { authenticateRoute } from "~/features/service/auth.server"
import {
  getIsFeatureEnabled,
  RemoteConfigKey,
} from "~/features/service/remote-config.server"
import { ErrorSection } from "~/features/ui/Error"

import { handle } from "./admin/index"

interface LoaderData {
  defaultNavbarCollapsed: boolean
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)

  const defaultNavbarCollapsed = await getIsFeatureEnabled(
    RemoteConfigKey.AdminNavCollapsed,
  )

  return json<LoaderData>({ defaultNavbarCollapsed })
}

export default function AdminIndex(): JSX.Element {
  const { defaultNavbarCollapsed } = useLoaderData<LoaderData>()

  const adminAppLinks: AdminLinkProps[] = handle.apps.map((app) => ({
    id: app.id,
    children: app.icon,
    title: app.name,
  }))

  const adminActionLinks: AdminLinkProps[] = [
    { id: "/logout", children: <LogoutIcon />, title: "Logout" },
  ]

  return (
    <AdminContext.Provider value={{ defaultNavbarCollapsed }}>
      <section
        id="admin"
        className={clsx(
          "fixed inset-0 h-screen w-screen p-4",
          "grid grid-cols-[3rem_1fr]",
        )}
        style={{
          paddingTop: `var(${CSS_VAR_HEADER_HEIGHT})`,
        }}
      >
        <aside className="h-full flex flex-col gap-2 items-center border-r border-divider">
          <NavLink
            to="."
            className="w-full h-12 flex-center border-b border-divider bg-secondary"
          >
            <AdminIcon />
          </NavLink>

          <div className="flex-1 flex flex-col gap-2 overflow-auto">
            {adminAppLinks.map((props) => (
              <AdminLink key={props.id} {...props} />
            ))}
          </div>

          <div className="flex-1 flex flex-col gap-2 justify-end pb-2">
            {adminActionLinks.map((props) => (
              <AdminLink key={props.id} {...props} isAction />
            ))}
          </div>
        </aside>

        <Outlet />
      </section>
    </AdminContext.Provider>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Oops. Admin broke!!!" error={error} />
}
