import { useLoaderData } from "@remix-run/react"
import type { ActionFunction } from "@remix-run/server-runtime"
import { type LoaderFunction, json, redirect } from "@remix-run/server-runtime"
import RefetchIcon from "remixicon-react/RestartLineIcon"
import invariant from "tiny-invariant"

import AdminFormAction from "~/features/admin/AdminFormAction"
import AdminLayout from "~/features/admin/AdminLayout"
import FeatureFlagForm from "~/features/admin/featureFlags/FeatureFlagForm"
import FeatureFlagsTable from "~/features/admin/featureFlags/FeatureFlagsTable"
import { CacheType, modifyCache } from "~/features/service/cache.server"
import {
  type FeatureFlagsMap,
  deleteFeatureFlag,
  getAllFeatureFlags,
  setFeatureFlag,
} from "~/features/service/remote-config.server"
import { ErrorSection } from "~/features/ui/Error"
import type { NavigationLinkProps } from "~/features/ui/Link"

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
  invariant(flag, "flag is required")

  if (method === "POST") {
    const devValue = form.get("dev")?.toString()
    const prodValue = form.get("prod")?.toString()
    const dev = devValue === "on" || devValue === "true"
    const prod = prodValue === "on" || prodValue === "true"

    await setFeatureFlag(flag, { dev, prod })
  }

  if (method === "DELETE") {
    await deleteFeatureFlag(flag)
  }

  await modifyCache("PUT", CacheType.RemoteConfig)
  return redirect(pathname)
}

export default function CacheIndex(): JSX.Element | null {
  const { featureFlags } = useLoaderData<LoaderData>()

  const actions: NavigationLinkProps[] = [
    {
      id: "Refetch",
      children: (
        <AdminFormAction title="Refetch config">
          <RefetchIcon />
        </AdminFormAction>
      ),
    },
  ]

  return (
    <AdminLayout
      name={"Feature flags"}
      header={<strong>{"Feature flags"}</strong>}
      actions={actions}
      className="flex flex-wrap gap-4 p-4"
    >
      <FeatureFlagForm />
      <FeatureFlagsTable featureFlags={featureFlags} />
    </AdminLayout>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ErrorSection title="Problem with Feature flags" message={error.message} />
  )
}
