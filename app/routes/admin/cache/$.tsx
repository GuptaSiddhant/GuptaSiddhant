import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"

import CodeBlock from "~/packages/components/CodeBlock"
import { ErrorSection } from "~/packages/components/Error"
import type { CacheType } from "~/packages/service/cache.server"
import { parseCacheKey } from "~/packages/service/cache.server"

interface LoaderData {
  key: string
  type: CacheType
  value?: string
  data: any
}

export const loader: LoaderFunction = async ({ params }) => {
  const key = params["*"]
  invariant(key, "Cache key is required")

  const { type, value } = parseCacheKey(key) || {}
  invariant(type, "Cache type is invalid")

  const data = await cache.get(key)

  return json<LoaderData>({ key, type, value, data })
}

export default function CacheDetails(): JSX.Element | null {
  const ld = useLoaderData<LoaderData>()

  return (
    <CodeBlock lang="json" wrap>
      {JSON.stringify(ld.data, null, 2)}
    </CodeBlock>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorSection title="Problem with Cache key" message={error.message} />
}
