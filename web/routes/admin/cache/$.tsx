import { AdminAppId, adminRegistry } from "@gs/admin"
import { createAdminMeta } from "@gs/admin/helpers"
import AdminLayout from "@gs/admin/layout/AdminLayout"
import { ONE_HOUR_IN_MS } from "@gs/constants"
import useMediaQuery from "@gs/hooks/useMediaQuery"
import { DeleteIcon } from "@gs/icons"
import type { NavigationLinkProps } from "@gs/navigation/types"
import { authenticateRoute } from "@gs/service/auth.server"
import type { ModifyCacheMethod } from "@gs/service/cache.server"
import { modifyCache } from "@gs/service/cache.server"
import {
  getCache,
  getCachedKey,
  hasCachedKey,
  parseCacheKey,
} from "@gs/service/cache.server"
import Action from "@gs/ui/Action"
import CodeBlock from "@gs/ui/CodeBlock"
import { ErrorSection } from "@gs/ui/Error"
import { transformMsToReadableString } from "@gs/utils/format"
import { useLoaderData } from "@remix-run/react"
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import clsx from "clsx"
import invariant from "tiny-invariant"

import { Paragraph } from "~/features/ui/Text"

interface LoaderData {
  key: string
  type: string
  value?: string
  data: any
  ttl: number
}

const adminApp = adminRegistry.getApp(AdminAppId.Cache)

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request)
  const key = params["*"]
  invariant(key, "Cache key is required")
  const { type, value } = parseCacheKey(key) || {}
  invariant(type, "Cache type is invalid")
  const isCached = hasCachedKey(key)

  if (!isCached) return redirect(adminApp.linkPath)

  const data = await getCachedKey(key)
  const ttl = getCache().getRemainingTTL(key)

  return json<LoaderData>({
    key,
    type,
    value,
    data,
    ttl,
  })
}

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request)

  const { pathname } = new URL(request.url)
  const form = await request.formData()
  const key = form.get("key")?.toString()

  invariant(key, "Cache key is required")
  await modifyCache(request.method as ModifyCacheMethod, key)

  if (request.method === "DELETE") {
    return redirect(adminApp.linkPath)
  }
  return redirect(pathname)
}

export default function CacheDetails(): JSX.Element | null {
  const { key, data } = useLoaderData<LoaderData>()

  const actions: NavigationLinkProps[] = [
    {
      id: "Delete",
      children: (
        <Action
          body={{ key }}
          title="Delete cache item"
          method="delete"
          action={`${adminApp.linkPath}/${key}`}
          toast={"Deleting cache item"}
        >
          <DeleteIcon />
        </Action>
      ),
    },
  ]

  return (
    <AdminLayout
      title={key}
      actions={actions}
      footer={<Footer />}
      className={clsx(data ? "flex flex-col gap-4 p-4" : "p-4 flex-center")}
    >
      {data ? (
        <CodeBlock lang="json" wrap codeClassName="text-sm" className="!m-0">
          {JSON.stringify(data, null, 2)}
        </CodeBlock>
      ) : (
        <Paragraph className="text-center text-base">
          The cache key does not contain any data.
          <br />
          <br />
          <span className="text-disabled">
            Maybe there was an error while fetching the data or the source gave
            an empty response.
          </span>
        </Paragraph>
      )}
    </AdminLayout>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection title="Problem with Cache key" error={error} />
}

export const meta: MetaFunction = ({ data }) => {
  return createAdminMeta(data?.key)
}

//

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
