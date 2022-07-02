import LRUCache from "lru-cache"

import { ONE_DAY_IN_MS } from "~/features/constants"

import {
  fetchFireStoreCollection,
  fetchFireStoreDocument,
} from "./firestore.server"
import { createLogger } from "./logger.server"
import { fetchFirebaseStorageFileUrl } from "./storage.server"

const cacheKeySeparator = "---"
const logger = createLogger("Cache")

export enum CacheType {
  FirestoreCollection = "collection",
  FirestoreDocument = "document",
  FirebaseStorageFileUrl = "storage-file-url",
}

const cacheFetchMethod: Record<CacheType, (value: string) => Promise<any>> = {
  [CacheType.FirestoreCollection]: fetchFireStoreCollection,
  [CacheType.FirestoreDocument]: fetchFireStoreDocument,
  [CacheType.FirebaseStorageFileUrl]: fetchFirebaseStorageFileUrl,
}

const cache =
  global.cache ||
  (global.cache = new LRUCache<string, any>({
    max: 100,
    allowStale: true,
    ttl: Number.parseInt(process.env?.CACHE_TTL || "0", 10) || ONE_DAY_IN_MS,
    fetchMethod: (key) => {
      const parsed = parseCacheKey(key)
      if (!parsed) return

      const { type, value } = parsed

      logger.info("Fetching:", key)
      return cacheFetchMethod[type as CacheType](value)
    },
  }))

export default cache

export function createCacheKey(type: CacheType, value?: string) {
  return [type, value].filter(Boolean).join(cacheKeySeparator)
}

export function parseCacheKey(key: string) {
  const [type, value] = key.split(cacheKeySeparator)
  if (!Object.values(CacheType).includes(type as CacheType)) {
    console.error(`CacheType '${type}' does not exist.`)
    return undefined
  }

  return { type: type as CacheType, value }
}

export type ModifyCacheMethod = "DELETE" | "PUT" | "POST"

export async function modifyCache(method: ModifyCacheMethod, key?: string) {
  switch (method) {
    case "DELETE": {
      if (key) {
        const promises = [...cache.keys()]
          .filter((k) => k.includes(key))
          .map((k) => {
            logger.debug('Deleted key "' + k + '" at', new Date().toISOString())
            return cache.delete(k)
          })

        return Promise.all(promises)
      } else {
        logger.debug("Cleared at", new Date().toISOString())
        return cache.clear()
      }
    }
    case "PUT": {
      if (key) {
        logger.debug(`Re-fetched ${key} at`, new Date().toISOString())
        cache.delete(key)
        return cache.fetch(key)
      } else {
        const keys = [...cache.keys()]
        const promises = keys.map((key) => {
          cache.delete(key)
          return cache.fetch(key)
        })
        logger.debug(`Re-fetched all at`, new Date().toISOString())
        return await Promise.all(promises)
      }
    }
  }
}
