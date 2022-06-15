import { Form, useLoaderData, useSubmit } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import clsx from "clsx"
import ClearIcon from "remixicon-react/DeleteBin2LineIcon"
import DownloadIcon from "remixicon-react/DownloadCloudLineIcon"
import invariant from "tiny-invariant"

import CodeBlock from "~/packages/components/CodeBlock"
import { ErrorSection } from "~/packages/components/Error"
import type { NavigationLinkProps } from "~/packages/components/Link"
import AdminLayout from "~/packages/layouts/AdminLayout"
import { CacheType } from "~/packages/service/cache.server"
import { parseCacheKey } from "~/packages/service/cache.server"

interface LoaderData {
  key: string
  type: CacheType
  value?: string
  data: any
  isStorageUrl: boolean
}

export const loader: LoaderFunction = async ({ params }) => {
  const key = params["*"]
  invariant(key, "Cache key is required")

  const { type, value } = parseCacheKey(key) || {}
  invariant(type, "Cache type is invalid")

  const isStorageUrl = type === CacheType.FirebaseStorageFileUrl

  const data = await cache.get(key)

  if (!data) return redirect("/admin/cache/")

  return json<LoaderData>({ key, type, value, data, isStorageUrl })
}

export default function CacheDetails(): JSX.Element | null {
  const submit = useSubmit()
  const { key, data, isStorageUrl } = useLoaderData<LoaderData>()

  const actions: NavigationLinkProps[] = [
    {
      id: "Refetch ",
      onClick: () => submit({ key }, { method: "put", replace: true }),
      children: <DownloadIcon aria-label="Refetch" />,
    },
    {
      id: "Delete",
      onClick: () => submit({ key }, { method: "delete", replace: true }),
      children: <ClearIcon aria-label="Delete" />,
    },
  ]

  return (
    <>
      <div
        className={clsx(
          "flex items-center px-4 py-2 gap-4 sticky top-0 z-[2] bg-primary",
          "border-b border-gray-700",
        )}
      >
        <strong className="font-bold ">{key}</strong>

        {actions.map((action) => (
          <AdminLayout.Action key={action.id} {...action} />
        ))}
      </div>

      <div className="p-4">
        <CodeBlock lang="json" wrap>
          {JSON.stringify(data, null, 2)}
        </CodeBlock>
      </div>

      {isStorageUrl ? (
        <div>
          <img src={data} alt={key} />
        </div>
      ) : null}
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Problem with Cache key" message={error.message} />
}
