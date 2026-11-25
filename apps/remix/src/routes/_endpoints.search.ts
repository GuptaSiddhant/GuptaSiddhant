import type { LoaderFunctionArgs } from "react-router";

import { ONE_HOUR_IN_MS } from "@gs/constants";
import { search } from "@gs/search/service.server";
import { fetchCachedKey } from "@gs/service/cache.server";

const searchCacheKey = "search";

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams, origin } = new URL(request.url);
  const query = searchParams.get("query")?.toString().trim();

  try {
    const results = await fetchCachedKey(
      [searchCacheKey, query ? `query="${query}"` : "::init::"],
      () => search(query, origin),
      { ttl: ONE_HOUR_IN_MS },
    );

    return Response.json(results);
  } catch {
    return Response.json(`Could not find data for query: '${query}'.`, {
      status: 404,
    });
  }
}

export function CatchBoundary() {}
