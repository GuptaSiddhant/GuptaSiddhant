import type { LoaderFunctionArgs } from "react-router";

import { ModifyCacheMethod, modifyCache } from "@gs/service/cache.server";
import invariant from "@gs/utils/invariant";

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key")?.toString().trim();

  try {
    invariant(key, "Cache key is required");
    await modifyCache(ModifyCacheMethod.DELETE, key);

    return Response.json(`Cleared cache for key: ${key}`);
  } catch {
    return Response.json(`Could not find/clear cache for key: '${key}'.`, {
      status: 404,
    });
  }
}

export function CatchBoundary() {}
