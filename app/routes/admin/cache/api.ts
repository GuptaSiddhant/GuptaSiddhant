import { type ActionFunction } from "@remix-run/node"

import cache, { modifyCache } from "~/packages/service/cache.server"

/**
 * Cache API endpoint for all fetched data.
 */
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const key = form.get("key")?.toString()

  console.log("[Cache api]", request.method, key)

  switch (request.method) {
    case "DELETE": {
      if (key) {
        const promises = [...cache.keys()]
          .filter((k) => k.includes(key))
          .map((k) => modifyCache("DELETE", k))
        await Promise.all(promises)
      } else await modifyCache("DELETE")
      break
    }

    case "PUT": {
      await modifyCache("REFETCH", key)
      break
    }
  }

  return null
}

export function CatchBoundary() {}
