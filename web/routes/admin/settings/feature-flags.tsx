import FeatureFlagsTable from "@gs/admin/featureFlags/FeatureFlagsTable"
import { createAdminMeta } from "@gs/admin/helpers"
import AdminLayout from "@gs/admin/layout/AdminLayout"
import type { NavigationLinkProps } from "@gs/navigation/types"
import { authenticateRoute } from "@gs/service/auth.server"
import {
  type FeatureFlagsMap,
  deleteFeatureFlag,
  getAllFeatureFlags,
  setFeatureFlag,
} from "@gs/service/feature-flag.server"
import useTransitionSubmissionToast from "@gs/toaster/useTransitionSubmissionToast"
import Action from "@gs/ui/Action"
import { ErrorSection } from "@gs/ui/Error"
import { useLoaderData } from "@remix-run/react"
import type {
  ActionFunction,
  ErrorBoundaryComponent,
} from "@remix-run/server-runtime"
import { type LoaderFunction, json, redirect } from "@remix-run/server-runtime"
import RefetchIcon from "remixicon-react/RestartLineIcon"
import invariant from "tiny-invariant"

interface LoaderData {
  featureFlags: FeatureFlagsMap
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)
  const featureFlags = await getAllFeatureFlags()
  invariant(featureFlags, "featureFlags could not be loaded")

  return json<LoaderData>({ featureFlags })
}

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request)
  const { pathname } = new URL(request.url)
  const { method } = request

  const form = await request.formData()
  const flag = form.get("flag")?.toString()

  if (method === "POST" || method === "PATCH") {
    invariant(flag, "flag is required")
    const devValue = form.get("dev")?.toString()
    const prodValue = form.get("prod")?.toString()
    const dev = devValue === "on" || devValue === "true"
    const prod = prodValue === "on" || prodValue === "true"

    await setFeatureFlag(flag, { dev, prod })
  }

  if (method === "DELETE") {
    invariant(flag, "flag is required")
    await deleteFeatureFlag(flag)
  }

  return redirect(pathname)
}

export default function CacheIndex(): JSX.Element | null {
  const { featureFlags } = useLoaderData<LoaderData>()

  const actions: NavigationLinkProps[] = [
    {
      id: "Refetch",
      children: (
        <Action.Form title="Refetch config" children={<RefetchIcon />} />
      ),
    },
  ]

  useTransitionSubmissionToast({
    PUT: "Refetching feature flags",
    POST: "Creating feature flag",
    DELETE: "Deleting feature flag",
    PATCH: "Updating feature flag",
  })

  return (
    <AdminLayout title={"Feature flags"} actions={actions}>
      <FeatureFlagsTable featureFlags={featureFlags} />
    </AdminLayout>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection title="Problem with Feature flags" error={error} />
}

export function meta() {
  return createAdminMeta("Feature flags")
}
