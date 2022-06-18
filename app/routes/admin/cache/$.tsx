import { useLoaderData, useLocation, useSubmit } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import ClearIcon from "remixicon-react/DeleteBin7LineIcon"
import PauseIcon from "remixicon-react/PauseCircleLineIcon"
import PlayIcon from "remixicon-react/PlayCircleLineIcon"
import RefetchIcon from "remixicon-react/RestartLineIcon"
import invariant from "tiny-invariant"

import AdminFormAction from "~/features/admin/AdminFormAction"
import AdminLayout from "~/features/admin/AdminLayout"
import { ONE_HOUR_IN_MS } from "~/features/constants"
import { transformMsToReadableString } from "~/features/helpers/format"
import useMediaQuery from "~/features/hooks/useMediaQuery"
import { useLoaderPolling } from "~/features/hooks/usePolling"
import {
  type ModifyCacheMethod,
  CacheType,
  modifyCache,
} from "~/features/service/cache.server"
import { parseCacheKey } from "~/features/service/cache.server"
import {
  getIsFeatureEnabled,
  RemoteConfigKey,
} from "~/features/service/remote-config.server"
import Accordion from "~/features/ui/Accordion"
import CodeBlock from "~/features/ui/CodeBlock"
import { ErrorSection } from "~/features/ui/Error"
import type { NavigationLinkProps } from "~/features/ui/Link"

interface LoaderData {
  key: string
  type: CacheType
  value?: string
  data: any
  isStorageUrl: boolean
  ttl: number
  defaultPauseCachePolling: boolean
}

export const loader: LoaderFunction = async ({ params }) => {
  const key = params["*"]
  invariant(key, "Cache key is required")
  const { type, value } = parseCacheKey(key) || {}
  invariant(type, "Cache type is invalid")

  const data = await cache.get(key)
  if (!data) return redirect("/admin/cache/")

  const ttl = cache.getRemainingTTL(key)
  const isStorageUrl = type === CacheType.FirebaseStorageFileUrl

  const defaultPauseCachePolling = await getIsFeatureEnabled(
    RemoteConfigKey.DefaultPauseCachePolling,
  )

  return json<LoaderData>({
    key,
    type,
    value,
    data,
    isStorageUrl,
    ttl,
    defaultPauseCachePolling,
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
  const { pathname } = useLocation()
  const { key, data, isStorageUrl } = useLoaderData<LoaderData>()

  const actions: NavigationLinkProps[] = [
    {
      id: "Refetch",
      onClick: () =>
        submit({ key }, { action: pathname, method: "put", replace: true }),
      children: (
        <AdminFormAction body={{ key }} title="Refresh">
          <RefetchIcon aria-label="Refetch" />
        </AdminFormAction>
      ),
    },
    {
      id: "Delete",
      onClick: () =>
        submit({ key }, { action: pathname, method: "delete", replace: true }),
      children: <ClearIcon aria-label="Delete" />,
    },
  ]

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
  return <ErrorSection title="Problem with Cache key" message={error.message} />
}

function Footer() {
  const { key, ttl, defaultPauseCachePolling } = useLoaderData<LoaderData>()
  const { paused, setPaused } = useLoaderPolling(
    { key },
    { defaultPause: defaultPauseCachePolling },
  )
  const isMobileWidth = useMediaQuery("(max-width: 768px)")

  return (
    <>
      <div className="text-sm text-disabled">
        {isMobileWidth ? "TTL: " : "Remaining time: "}
        {isMobileWidth
          ? new Intl.NumberFormat(undefined, {
              style: "unit",
              unit: "hour",
            }).format(ttl / ONE_HOUR_IN_MS)
          : transformMsToReadableString(ttl)}
      </div>

      <button
        onClick={() => setPaused((p) => !p)}
        className="text-sm flex items-center gap-1"
      >
        {paused ? <PlayIcon /> : <PauseIcon />}
        {isMobileWidth ? "" : (paused ? "Resume" : "Pause") + " polling"}
      </button>
    </>
  )
}
