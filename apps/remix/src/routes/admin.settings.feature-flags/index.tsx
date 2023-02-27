import { useLoaderData } from "@remix-run/react";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
} from "@remix-run/server-runtime";
import { type LoaderFunction, json, redirect } from "@remix-run/server-runtime";
import RefetchIcon from "remixicon-react/RestartLineIcon";

import { createAdminMeta } from "@gs/admin/helpers";
import AdminLayout from "@gs/admin/layout";
import { UserRole } from "@gs/models/users";
import { authenticateRoute } from "@gs/service/auth.server";
import {
  type FeatureFlagsMap,
  deleteFeatureFlag,
  getAllFeatureFlags,
  invalidateFeatureFlagsCache,
  setFeatureFlag,
} from "@gs/service/feature-flag.server";
import useTransitionSubmissionToast from "@gs/toaster/useTransitionSubmissionToast";
import type { NavigationLinkProps } from "@gs/types";
import Action from "@gs/ui/Action";
import { ErrorSection } from "@gs/ui/Error";
import invariant from "@gs/utils/invariant";

import FeatureFlagsTable from "./FeatureFlagsTable";

interface LoaderData {
  featureFlags: FeatureFlagsMap;
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request, UserRole.ADMIN);
  const featureFlags = await getAllFeatureFlags();
  invariant(featureFlags, "featureFlags could not be loaded");

  return json<LoaderData>({ featureFlags });
};

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request);
  const { pathname } = new URL(request.url);

  const form = await request.formData();
  const flag = form.get("flag")?.toString();
  const intent = form.get("intent")?.toString();

  if (intent === "delete") {
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
};

export default function CacheIndex(): JSX.Element | null {
  const { featureFlags } = useLoaderData<LoaderData>();

  const actions: NavigationLinkProps[] = [
    {
      id: "invalidate-cache",
      children: (
        <Action
          title="Invalidate cache"
          children={<RefetchIcon />}
          method="patch"
        />
      ),
    },
  ];

  useTransitionSubmissionToast({
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

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection title="Problem with Feature flags" error={error} />;
};

export function meta() {
  return createAdminMeta("Feature flags");
}
