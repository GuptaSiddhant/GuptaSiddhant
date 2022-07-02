import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import DeleteIcon from "remixicon-react/DeleteBin7LineIcon"
import RefetchIcon from "remixicon-react/RestartLineIcon"
import invariant from "tiny-invariant"

import AdminLayout from "~/features/admin/AdminLayout"
import { ONE_HOUR_IN_MS } from "~/features/constants"
import { transformMsToReadableString } from "~/features/helpers/format"
import useMediaQuery from "~/features/hooks/useMediaQuery"
import type { NavigationLinkProps } from "~/features/navigation/types"
import {
  type ModifyCacheMethod,
  CacheType,
  modifyCache,
} from "~/features/service/cache.server"
import { parseCacheKey } from "~/features/service/cache.server"
import useTransitionSubmissionToast from "~/features/toaster/useTransitionSubmissionToast"
import Accordion from "~/features/ui/Accordion"
import CodeBlock from "~/features/ui/CodeBlock"
import { ErrorSection } from "~/features/ui/Error"
import FormAction from "~/features/ui/FormAction"

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

  const data = await cache.fetch(key)
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
  })
}

export const action: ActionFunction = async ({ request }) => {
  const { pathname } = new URL(request.url)
  const form = await request.formData()
  const key = form.get("key")?.toString()
  console.log("[key]", key)
  await modifyCache(request.method as ModifyCacheMethod, key)

  return redirect(pathname)
}

export default function CacheDetails(): JSX.Element | null {
  const { key, data, isStorageUrl } = useLoaderData<LoaderData>()

  const actions: NavigationLinkProps[] = [
    {
      id: "Refetch",
      children: (
        <FormAction body={{ key }} title="Refresh" method="put">
          <RefetchIcon />
        </FormAction>
      ),
    },
    {
      id: "Delete",
      children: (
        <FormAction body={{ key }} title="Delete" method="delete">
          <DeleteIcon />
        </FormAction>
      ),
    },
  ]

  useTransitionSubmissionToast({
    DELETE: `Deleting cache key "${key}"`,
    PUT: `Refetching cache key "${key}"`,
  })

  return (
    <AdminLayout
      name={key}
      header={<strong>{key}</strong>}
      actions={actions}
      footer={<Footer />}
      className="flex flex-col gap-4 p-4"
    >
      <Accordion open summary="Cached data" className="bg-default">
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
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Problem with Cache key" error={error} />
}

function Footer() {
  const { ttl } = useLoaderData<LoaderData>()
  const isMobileWidth = useMediaQuery("(max-width: 768px)")

  return (
    <div className="text-sm text-disabled">
      {isMobileWidth ? "TTL: " : "Remaining time: "}
      {isMobileWidth
        ? new Intl.NumberFormat(undefined, {
            style: "unit",
            unit: "hour",
          }).format(ttl / ONE_HOUR_IN_MS)
        : transformMsToReadableString(ttl)}
    </div>
  )
}
