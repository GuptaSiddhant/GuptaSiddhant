import { ErrorSection } from "@features/ui/Error"
import { Outlet } from "@remix-run/react"
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime"

export default function Blog(): JSX.Element {
  return <Outlet />
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection title="Problem with blog" error={error} />
}
