import { Outlet } from "@remix-run/react";
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime";

import { ErrorSection } from "@gs/ui/Error";

export default function Projects(): JSX.Element {
  return <Outlet />;
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection title="Problem with projects" error={error} />;
};
