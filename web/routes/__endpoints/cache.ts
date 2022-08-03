import invariant from "@gs/utils/invariant"

import { type LoaderFunction, json } from "@remix-run/server-runtime"

import { modifyCache, ModifyCacheMethod } from "@gs/service/cache.server"

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key")?.toString().trim()

  try {
    invariant(key, "Cache key is required")
    await modifyCache(ModifyCacheMethod.DELETE, key)

    return json(`Cleared cache for key: ${key}`, 200)
  } catch {
    return json(`Could not find/clear cache for key: '${key}'.`, 404)
  }
}

export function CatchBoundary() {}
