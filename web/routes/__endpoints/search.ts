import { fetchCachedKey } from "@gs/service/cache.server"
import { type LoaderFunction, json } from "@remix-run/server-runtime"

import { ONE_HOUR_IN_MS } from "~/features/constants"
import { search } from "~/features/search/service.server"

const searchCacheKey = "search"

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams, origin } = new URL(request.url)
  const query = searchParams.get("query")?.toString().trim()

  try {
    const results = await fetchCachedKey(
      `${searchCacheKey}/${query || "::init::"}`,
      () => search(query, origin),
      { ttl: ONE_HOUR_IN_MS },
    )

    return json(results)
  } catch {
    return json(`Could not find data for query: '${query}'.`, 404)
  }
}

export function CatchBoundary() {}
