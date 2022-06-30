import { useLoaderData } from "@remix-run/react"
import type { ActionFunction } from "@remix-run/server-runtime"
import { type LoaderFunction, json, redirect } from "@remix-run/server-runtime"
import RefetchIcon from "remixicon-react/RestartLineIcon"
import invariant from "tiny-invariant"

import { createAdminMeta } from "~/features/admin"
import AdminLayout from "~/features/admin/AdminLayout"
import FeatureFlagsTable from "~/features/admin/featureFlags/FeatureFlagsTable"
import type { NavigationLinkProps } from "~/features/navigation/types"
import { CacheType, modifyCache } from "~/features/service/cache.server"
import {
  type FeatureFlagsMap,
  deleteFeatureFlag,
  getAllFeatureFlags,
  setFeatureFlag,
} from "~/features/service/remote-config.server"
import useTransitionSubmissionToast from "~/features/toaster/useTransitionSubmissionToast"
import { ErrorSection } from "~/features/ui/Error"
import FormAction from "~/features/ui/FormAction"

interface LoaderData {
  featureFlags: FeatureFlagsMap
}

export const loader: LoaderFunction = async ({ params }) => {
  const featureFlags = await getAllFeatureFlags()
  invariant(featureFlags, "featureFlags could not be loaded")

  return json<LoaderData>({ featureFlags })
}

export const action: ActionFunction = async ({ request }) => {
  const { url, method } = request
  const { pathname } = new URL(url)
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

  await modifyCache("PUT", CacheType.RemoteConfig)
  return redirect(pathname)
}

export default function CacheIndex(): JSX.Element | null {
  const { featureFlags } = useLoaderData<LoaderData>()
  useTransitionSubmissionToast({
    PUT: "Refetching feature flags",
    POST: "Creating feature flag",
    DELETE: "Deleting feature flag",
    PATCH: "Updating feature flag",
  })

  const actions: NavigationLinkProps[] = [
    {
      id: "Refetch",
      children: (
        <FormAction
          title="Refetch config"
          children={<RefetchIcon />}
          method="put"
        />
      ),
    },
  ]

  return (
    <AdminLayout
      name={"Feature flags"}
      header={<strong>{"Feature flags"}</strong>}
      actions={actions}
    >
      <FeatureFlagsTable featureFlags={featureFlags} />
    </AdminLayout>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Problem with Feature flags" error={error} />
}

export function meta() {
  return createAdminMeta("Feature flags")
}
