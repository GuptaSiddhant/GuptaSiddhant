import { cache, logCache } from "@gs/firebase/firestore.server"
import { json, redirect, type LoaderFunction } from "@remix-run/node"

/**
 * Cache API endpoint for all fetched data.
 */
export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url)
  const type = url.searchParams.get("type")
  const key = url.searchParams.get("key")

  switch (type) {
    case "delete": {
      if (key) {
        cache.delete(key)
        logCache('Deleted key "' + key + '" at', new Date().toISOString())
      }
      break
    }
    case "get": {
      if (key) {
        const value = cache.get(key)
        logCache('Got key "' + key + '" at', new Date().toISOString())
        return json(value)
      } else {
        logCache("Got dump at", new Date().toISOString())
        return json(cache.dump())
      }
    }
    case "clear":
    default: {
      cache.clear()
      logCache("Cleared at", new Date().toISOString())
      break
    }
  }

  return redirect("/")
}