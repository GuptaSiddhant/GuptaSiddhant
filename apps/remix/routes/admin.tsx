import { adminRegistry } from "@features/admin"
import AdminSidebar from "@features/admin/components/AdminSidebar"
import { AdminContext } from "@features/admin/context"
import { CSS_VAR_HEADER_HEIGHT } from "@features/constants"
import useBlockNativeScroll from "@features/hooks/useBlockNativeScroll"
import { authenticateRoute } from "@features/service/auth.server"
import { CatchBoundarySection, ErrorSection } from "@features/ui/Error"
import { type ShouldReloadFunction, Outlet } from "@remix-run/react"
import {
  type ErrorBoundaryComponent,
  type LoaderFunction,
  json,
} from "@remix-run/server-runtime"
import clsx from "clsx"

interface LoaderData {}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)

  return json<LoaderData>({})
}

export default function Admin(): JSX.Element {
  useBlockNativeScroll()

  return (
    <AdminContext.Provider value={{}}>
      <section
        id="admin"
        className={clsx(
          "fixed inset-0 h-screen -w-screen-m4 py-4",
          "mx-4 grid grid-cols-[max-content_1fr] bg-primary",
        )}
        style={{
          paddingTop: `var(${CSS_VAR_HEADER_HEIGHT})`,
        }}
      >
        <AdminSidebar
          actions={adminRegistry.actions.map((action) => ({
            ...action,
            children: action.icon,
          }))}
          apps={adminRegistry.apps.map((app) => ({
            ...app,
            children: app.icon,
          }))}
        />

        <Outlet />
      </section>
    </AdminContext.Provider>
  )
}

export const CatchBoundary = () => {
  return <CatchBoundarySection />
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection title="Oops. Admin broke!!!" error={error} />
}

export const unstable_shouldReload: ShouldReloadFunction = () => false
