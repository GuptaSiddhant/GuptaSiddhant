import { useLoaderData, useLocation } from "@remix-run/react"
import { type LoaderFunction, json } from "@remix-run/server-runtime"
import RefetchIcon from "remixicon-react/RestartLineIcon"
import invariant from "tiny-invariant"

import AdminFormAction from "~/features/admin/AdminFormAction"
import AdminLayout from "~/features/admin/AdminLayout"
import {
  type RemoteConfigBooleanMap,
  getAllRemoteConfigFeatures,
} from "~/features/service/remote-config.server"
import Accordion from "~/features/ui/Accordion"
import CodeBlock from "~/features/ui/CodeBlock"
import { ErrorSection } from "~/features/ui/Error"
import type { NavigationLinkProps } from "~/features/ui/Link"

interface LoaderData {
  featureFlags: RemoteConfigBooleanMap
}

export const loader: LoaderFunction = async ({ params }) => {
  const featureFlags = await getAllRemoteConfigFeatures()
  invariant(featureFlags, "featureFlags could not be loaded")

  return json<LoaderData>({ featureFlags })
}

export default function CacheIndex(): JSX.Element | null {
  const currentPathname = useLocation().pathname
  const { featureFlags } = useLoaderData<LoaderData>()

  const actions: NavigationLinkProps[] = [
    {
      id: "Refetch",
      children: (
        <AdminFormAction body={{ currentPathname }} title="Refetch config">
          <RefetchIcon />
        </AdminFormAction>
      ),
    },
  ]

  return (
    <AdminLayout
      name={"Feature flags"}
      header={<strong>{"Feature flags"}</strong>}
      className="flex flex-col gap-4 p-4"
      actions={actions}
    >
      <Accordion open summary="Data" className="bg-default">
        <CodeBlock lang="json" codeClassName="text-sm" className="!m-0">
          {JSON.stringify({ featureFlags }, null, 2)}
        </CodeBlock>
      </Accordion>
    </AdminLayout>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ErrorSection title="Problem with Config key" message={error.message} />
  )
}
