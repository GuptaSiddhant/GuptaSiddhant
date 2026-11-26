import clsx from "clsx";

import {
  type LoaderFunctionArgs,
  type MetaDescriptor,
  Outlet,
  data,
  useLocation,
  useRouteError,
} from "react-router";

import { CSS_VAR_HEADER_HEIGHT } from "@gs/constants";
import useBlockNativeScroll from "@gs/hooks/useBlockNativeScroll";
import { authenticateRoute } from "@gs/service/auth.server";
import { UserRole } from "@gs/models/users.model";
import { ShouldRevalidateFunctionArgs } from "@gs/types";
import { ErrorSection } from "@gs/ui/Error";

import { adminRegistry } from "./features";
import AdminSidebar from "./features/components/AdminSidebar";
import { AdminContext } from "./features/context";

// oxlint-disable-next-line typescript/no-empty-interface -- For future reference
interface LoaderData {}

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticateRoute(request, UserRole.EDITOR);

  return data<LoaderData>({});
}

export function meta(): MetaDescriptor[] {
  const viewport = [
    "width=device-width",
    "initial-scale=1.0",
    "viewport-fit=cover",
    "maximum-scale=1.0",
  ]
    .filter(Boolean)
    .join(",");

  return [{ viewport }];
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
        style={{ marginTop: `var(${CSS_VAR_HEADER_HEIGHT})` }}
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

export function ErrorBoundary() {
  return <ErrorSection error={useRouteError()} title="Oops. Admin broke!!!" />;
}

export function shouldRevalidate(_: ShouldRevalidateFunctionArgs) {
  return true;
}
