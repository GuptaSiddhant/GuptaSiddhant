import { useLoaderData, useRouteError } from "@remix-run/react";
import {
  type DataFunctionArgs,
  json,
  redirect,
} from "@remix-run/server-runtime";
import RefetchIcon from "remixicon-react/RestartLineIcon";

import { UserRole } from "@gs/models/users.model";
import { authenticateRoute } from "@gs/service/auth.server";
import {
  type FeatureFlagsMap,
  deleteFeatureFlag,
  getAllFeatureFlags,
  invalidateFeatureFlagsCache,
  setFeatureFlag,
} from "@gs/service/feature-flag.server";
import useNavigationSubmissionToast from "@gs/toaster/useNavigationSubmissionToast";
import type { NavigationLinkProps } from "@gs/types";
import Action from "@gs/ui/Action";
import { ErrorSection } from "@gs/ui/Error";
import invariant from "@gs/utils/invariant";

import FeatureFlagsTable from "./features/components/FeatureFlagsTable";
import { createAdminMeta } from "./features/helpers";
import AdminLayout from "./features/layout";

interface LoaderData {
  featureFlags: FeatureFlagsMap;
}

export async function loader({ request }: DataFunctionArgs) {
  await authenticateRoute(request, UserRole.ADMIN);
  const featureFlags = await getAllFeatureFlags();
  invariant(featureFlags, "featureFlags could not be loaded");

  return json<LoaderData>({ featureFlags });
}

export async function action({ request }: DataFunctionArgs) {
  await authenticateRoute(request);
  const { pathname } = new URL(request.url);

  const form = await request.formData();
  const flag = form.get("flag")?.toString();
  const intent = form.get("intent")?.toString();

  if (intent?.toUpperCase() === "DELETE") {
    invariant(flag, "flag is required");
    await deleteFeatureFlag(flag);
  } else {
    invariant(flag, "flag is required");
    const devValue = form.get("dev")?.toString();
    const prodValue = form.get("prod")?.toString();
    const dev = devValue === "on" || devValue === "true";
    const prod = prodValue === "on" || prodValue === "true";

    await setFeatureFlag(flag, { dev, prod });
  }

  invalidateFeatureFlagsCache();

  return redirect(pathname);
}

export default function CacheIndex(): JSX.Element | null {
  const { featureFlags } = useLoaderData<LoaderData>();

  const actions: NavigationLinkProps[] = [
    {
      id: "invalidate-cache",
      children: (
        <Action
          title="Invalidate cache"
          children={<RefetchIcon />}
          method="PATCH"
        />
      ),
    },
  ];

  useNavigationSubmissionToast({
    PUT: "Refetching feature flags",
    POST: "Creating feature flag",
    DELETE: "Deleting feature flag",
    PATCH: "Updating feature flag",
  });

  return (
    <AdminLayout title={"Feature flags"} actions={actions}>
      <FeatureFlagsTable featureFlags={featureFlags} />
    </AdminLayout>
  );
}

export function ErrorBoundary() {
  return (
    <ErrorSection
      error={useRouteError()}
      title={"Problem with Feature flags."}
    />
  );
}

export const meta = createAdminMeta("Feature flags");
