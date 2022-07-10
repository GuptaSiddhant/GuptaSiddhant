import { transformMsToReadableString } from "@gs/utils/format"
import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import DeleteIcon from "remixicon-react/DeleteBin7LineIcon"
import invariant from "tiny-invariant"

import { createAdminMeta } from "~/features/admin"
import AdminLayout from "~/features/admin/layout/AdminLayout"
import { ONE_HOUR_IN_MS } from "~/features/constants"
import useMediaQuery from "~/features/hooks/useMediaQuery"
import type { NavigationLinkProps } from "~/features/navigation/types"
import { authenticateRoute } from "~/features/service/auth.server"
import type { CacheType } from "~/features/service/cache.server"
import {
  getCache,
  getCachedKey,
  parseCacheKey,
} from "~/features/service/cache.server"
import Action from "~/features/ui/Action"
import CodeBlock from "~/features/ui/CodeBlock"
import { ErrorSection } from "~/features/ui/Error"

interface LoaderData {
  key: string
  type: CacheType
  value?: string
  data: any
  ttl: number
}

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request)
  const key = params["*"]
  invariant(key, "Cache key is required")
  const { type, value } = parseCacheKey(key) || {}
  invariant(type, "Cache type is invalid")

  const data = await getCachedKey(key)
  if (!data) return redirect("/admin/cache/")

  const ttl = getCache().getRemainingTTL(key)

  return json<LoaderData>({
    key,
    type,
    value,
    data,
    ttl,
  })
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
          toast={{
            title: "Deleting cache item",
          }}
        >
          <DeleteIcon />
        </Action>
      ),
    },
  ]

  return (
    <AdminLayout
      name={key}
      actions={actions}
      footer={<Footer />}
      className="flex flex-col gap-4 p-4"
    >
      <CodeBlock lang="json" wrap codeClassName="text-sm" className="!m-0">
        {JSON.stringify(data, null, 2)}
      </CodeBlock>
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

export const meta: MetaFunction = ({ data }) => {
  return createAdminMeta(data?.key)
}
