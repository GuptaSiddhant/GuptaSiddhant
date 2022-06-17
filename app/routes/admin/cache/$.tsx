import { useLoaderData, useSubmit } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import { useEffect } from "react"
import ClearIcon from "remixicon-react/DeleteBin2LineIcon"
import RefetchIcon from "remixicon-react/RestartLineIcon"
import invariant from "tiny-invariant"

import AdminLayout from "~/packages/admin/AdminLayout"
import { transformMsToReadableString } from "~/packages/helpers/format"
import {
  type ModifyCacheMethod,
  CacheType,
  modifyCache,
} from "~/packages/service/cache.server"
import { parseCacheKey } from "~/packages/service/cache.server"
import Accordion from "~/packages/ui/Accordion"
import CodeBlock from "~/packages/ui/CodeBlock"
import { ErrorSection } from "~/packages/ui/Error"
import type { NavigationLinkProps } from "~/packages/ui/Link"

interface LoaderData {
  key: string
  type: CacheType
  value?: string
  data: any
  isStorageUrl: boolean
  ttl: number
  pathname: string
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const { pathname } = new URL(request.url)

  const key = params["*"]
  invariant(key, "Cache key is required")
  const { type, value } = parseCacheKey(key) || {}
  invariant(type, "Cache type is invalid")

  const data = await cache.get(key)
  if (!data) return redirect("/admin/cache/")

  const ttl = cache.getRemainingTTL(key)
  const isStorageUrl = type === CacheType.FirebaseStorageFileUrl

  return json<LoaderData>({
    key,
    type,
    value,
    data,
    isStorageUrl,
    ttl,
    pathname,
  })
}

export const action: ActionFunction = async ({ request }) => {
  const { pathname } = new URL(request.url)
  const form = await request.formData()
  const key = form.get("key")?.toString()
  await modifyCache(request.method as ModifyCacheMethod, key)

  return redirect(pathname)
}

export default function CacheDetails(): JSX.Element | null {
  const submit = useSubmit()
  const loaderData = useLoaderData<LoaderData>()
  const { key, data, isStorageUrl, ttl, pathname } = loaderData

  const actions: NavigationLinkProps[] = [
    {
      id: "Refetch ",
      onClick: () =>
        submit({ key }, { action: pathname, method: "put", replace: true }),
      children: <RefetchIcon aria-label="Refetch" />,
    },
    {
      id: "Delete",
      onClick: () =>
        submit({ key }, { action: pathname, method: "delete", replace: true }),
      children: <ClearIcon aria-label="Delete" />,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      submit({ key }, { method: "get", action: pathname, replace: true })
    }, 5_000)

    return () => clearInterval(interval)
  }, [submit, key, pathname])

  return (
    <>
      <AdminLayout
        name={key}
        header={<strong>{key}</strong>}
        actions={actions}
        footer={
          <span className="text-sm text-disabled">
            Remaining time to expire: {transformMsToReadableString(ttl)}
          </span>
        }
        className="flex flex-col gap-4 p-4"
      >
        <Accordion open summary="Data" className="bg-default">
          <CodeBlock lang="json" wrap codeClassName="text-sm" className="!m-0">
            {JSON.stringify(data, null, 2)}
          </CodeBlock>
        </Accordion>

        {isStorageUrl ? (
          <Accordion open summary={"Image preview"} className="bg-default">
            <img src={data} alt={key} className="p-2 pt-0" />
          </Accordion>
        ) : null}
      </AdminLayout>
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Problem with Cache key" message={error.message} />
}
