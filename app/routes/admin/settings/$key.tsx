import { useLoaderData } from "@remix-run/react"
import { type LoaderFunction, json } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"

import AdminLayout from "~/features/admin/AdminLayout"
import {
  getIsFeatureEnabled,
  RemoteConfigKey,
} from "~/features/service/remote-config.server"
import Accordion from "~/features/ui/Accordion"
import CodeBlock from "~/features/ui/CodeBlock"
import { ErrorSection } from "~/features/ui/Error"

interface LoaderData {
  enabled: boolean
  key: RemoteConfigKey
}

export const loader: LoaderFunction = async ({ params }) => {
  const key = params.key as RemoteConfigKey | undefined
  invariant(key, "Config key is required")
  invariant(
    Object.values(RemoteConfigKey).includes(key),
    "Config key is not supported",
  )

  const enabled = await getIsFeatureEnabled(key as RemoteConfigKey)

  return json<LoaderData>({ key, enabled })
}

export default function CacheIndex(): JSX.Element | null {
  const { key, enabled } = useLoaderData<LoaderData>()

  return (
    <AdminLayout
      name={key}
      header={<strong>{key}</strong>}
      className="flex flex-col gap-4 p-4"
    >
      <Accordion open summary="Data" className="bg-default">
        <CodeBlock lang="json" codeClassName="text-sm" className="!m-0">
          {JSON.stringify({ [key]: enabled }, null, 2)}
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
