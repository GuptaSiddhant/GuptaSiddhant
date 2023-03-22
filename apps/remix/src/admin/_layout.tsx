import clsx from "clsx";

import { Outlet, useLocation } from "@remix-run/react";
import {
  type ErrorBoundaryComponent,
  type LoaderArgs,
  type MetaDescriptor,
  json,
} from "@remix-run/server-runtime";

import { adminRegistry } from "@gs/admin";
import AdminSidebar from "@gs/admin/components/AdminSidebar";
import { AdminContext } from "@gs/admin/context";
import { CSS_VAR_HEADER_HEIGHT } from "@gs/constants";
import useBlockNativeScroll from "@gs/hooks/useBlockNativeScroll";
import { authenticateRoute } from "@gs/service/auth.server";
import { ShouldRevalidateFunctionArgs } from "@gs/types";
import { CatchBoundarySection, ErrorSection } from "@gs/ui/Error";

// rome-ignore lint/nursery/noEmptyInterface: For future reference
interface LoaderData {}

export async function loader({ request }: LoaderArgs) {
  await authenticateRoute(request);

  return json<LoaderData>({});
}

export function meta(): MetaDescriptor {
  const viewport = [
    "width=device-width",
    "initial-scale=1.0",
    "viewport-fit=cover",
    "maximum-scale=1.0",
  ]
    .filter(Boolean)
    .join(",");

  return { viewport };
}

export default function Admin(): JSX.Element {
  useBlockNativeScroll();
  const isChildPathVisible =
    useLocation().pathname.split("/").filter(Boolean).length > 1;

  return (
    <AdminContext.Provider value={{}}>
      <section
        id="admin"
        className={clsx(
          "fixed inset-0 m-4 bg-primary",
          "grid grid-cols-[1fr] ",
          isChildPathVisible ? "pl-12" : "pl-80",
        )}
        style={{
          marginTop: `var(${CSS_VAR_HEADER_HEIGHT})`,
        }}
      >
        <AdminSidebar
          apps={adminRegistry.apps.map((app) => ({
            ...app,
            children: app.icon,
          }))}
          actions={adminRegistry.actions.map((action) => ({
            ...action,
            children: action.icon,
          }))}
          isChildPathVisible={isChildPathVisible}
        />

        <Outlet />
      </section>
    </AdminContext.Provider>
  );
}

export const CatchBoundary = () => {
  return <CatchBoundarySection />;
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection title="Oops. Admin broke!!!" error={error} />;
};

export function shouldRevalidate(_: ShouldRevalidateFunctionArgs) {
  return true;
}
