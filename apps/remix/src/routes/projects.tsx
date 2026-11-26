import { Outlet, useRouteError } from "react-router";

import { ErrorSection } from "@gs/ui/Error";

export default function Projects(): JSX.Element {
  return <Outlet />;
}

export function ErrorBoundary() {
  return (
    <ErrorSection error={useRouteError()} title={"Problem with projects."} />
  );
}
