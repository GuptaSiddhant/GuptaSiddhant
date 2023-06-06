import { Outlet, useRouteError } from "@remix-run/react";

import { ErrorSection } from "@gs/ui/Error";

export default function Blog(): JSX.Element {
  return <Outlet />;
}

export function ErrorBoundary() {
  return <ErrorSection error={useRouteError()} title={"Problem with blog."} />;
}
