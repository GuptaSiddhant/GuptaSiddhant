import { useLoaderData, useSubmit } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import ClearIcon from "remixicon-react/DeleteBin2LineIcon"
import RefetchIcon from "remixicon-react/RestartLineIcon"
import invariant from "tiny-invariant"

import CodeBlock from "~/packages/components/CodeBlock"
import { ErrorSection } from "~/packages/components/Error"
import type { NavigationLinkProps } from "~/packages/components/Link"
import { transformMsToReadableString } from "~/packages/helpers/format"
import AdminLayout from "~/packages/layouts/AdminLayout"
import { CacheType } from "~/packages/service/cache.server"
import { parseCacheKey } from "~/packages/service/cache.server"

interface LoaderData {
  key: string
  type: CacheType
  value?: string
  data: any
  isStorageUrl: boolean
  ttl: number
}

export const loader: LoaderFunction = async ({ params }) => {
  const key = params["*"]
  invariant(key, "Cache key is required")
  const { type, value } = parseCacheKey(key) || {}
  invariant(type, "Cache type is invalid")

  const isStorageUrl = type === CacheType.FirebaseStorageFileUrl

  const data = await cache.get(key)
  if (!data) return redirect("/admin/cache/")

  const ttl = cache.getRemainingTTL(key)

  return json<LoaderData>({ key, type, value, data, isStorageUrl, ttl })
}

export default function CacheDetails(): JSX.Element | null {
  const submit = useSubmit()
  const { key, data, isStorageUrl, ttl } = useLoaderData<LoaderData>()

  const actions: NavigationLinkProps[] = [
    {
      id: "Refetch ",
      onClick: () => submit({ key }, { method: "put", replace: true }),
      children: <RefetchIcon aria-label="Refetch" />,
    },
    {
      id: "Delete",
      onClick: () => submit({ key }, { method: "delete", replace: true }),
      children: <ClearIcon aria-label="Delete" />,
    },
  ]

  return (
    <>
      <AdminLayout
        name={key}
        header={<strong>{key}</strong>}
        actions={actions}
        navGroups={[]}
        footer={
          <span className="text-sm">
            Remaining time to expire: {transformMsToReadableString(ttl)}
          </span>
        }
      >
        <div className="px-8 py-4">
          <CodeBlock lang="json" wrap>
            {JSON.stringify(data, null, 2)}
          </CodeBlock>
        </div>

        {isStorageUrl ? (
          <div>
            <img src={data} alt={key} />
          </div>
        ) : null}
      </AdminLayout>
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Problem with Cache key" message={error.message} />
}
