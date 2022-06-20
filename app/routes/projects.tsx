import { Outlet } from "@remix-run/react"

import { ErrorSection } from "~/features/ui/Error"

export default function Blog(): JSX.Element {
  return <Outlet />
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Problem with projects" error={error} />
}
