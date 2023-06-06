import { Outlet, useRouteError } from "@remix-run/react";

import { ErrorSection } from "@gs/ui/Error";

export default function Projects(): JSX.Element {
  return <Outlet />;
}

export function ErrorBoundary() {
  return (
    <ErrorSection error={useRouteError()} title={"Problem with projects."} />
  );
}
