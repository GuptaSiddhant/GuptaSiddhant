import { ONE_DAY_IN_MS } from "@features/constants"
import LRUCache, { type Options } from "lru-cache"

import { createLogger } from "./logger.server"

const logger = createLogger("Cache")

declare global {
  var appCache: LRUCache<string, unknown>
}

const appCache =
  global.appCache ||
  (global.appCache = new LRUCache<string, unknown>({
    max: 300,
    allowStale: true,
    ttl: Number.parseInt(process.env?.CACHE_TTL || "0", 10) || ONE_DAY_IN_MS,
  }))

export enum CacheType {
  DatabaseModel = "firestore-collection",
  FirestoreDocument = "firestore-document",
  FirebaseStorageFileUrl = "firebase-storage-file-url",
}

// Utils

export function getCache() {
  return appCache
}
export function getCachedKeys(): string[] {
  return [...getCache().keys()]
}

export function getCachedKey(key: string) {
  const cache = getCache()
  if (cache.has(key)) return cache.get(key)
}

export async function fetchCachedKey<T>(
  key: string,
  fn: () => Promise<T>,
  options?: Options<string, unknown>,
): Promise<T> {
  const cache = getCache()

  if (cache.has(key)) return cache.get(key) as T

  logger.info("Fetching:", key)
  const result = await fn()

  cache.set(key, result, options)

  return result
}

export type ModifyCacheMethod = "DELETE"

export async function modifyCache(method: ModifyCacheMethod, key?: string) {
  switch (method) {
    case "DELETE": {
      if (key) {
        return deleteCachedKeysWith(key)
      } else {
        return clearCache()
      }
    }
  }
}

export function deleteCachedKeysWith(key: string) {
  return getCachedKeys()
    .filter((k) => k.includes(key))
    .forEach(deleteCachedKey)
}

export function deleteCachedKey(key: string) {
  logger.debug('Deleted key "' + key + '":', new Date().toISOString())
  return getCache().delete(key)
}

export function clearCache() {
  logger.debug("Cleared:", new Date().toISOString())
  return getCache().clear()
}

export function createCacheKey(type: string, value: string) {
  return [type, value].filter(Boolean).join("::")
}

export function parseCacheKey(
  key: string,
): { type: CacheType; value: string } | undefined {
  if (key.includes("::")) {
    const [type, value] = key.split("::")
    if (!Object.values(CacheType).includes(type as CacheType)) {
      console.error(`CacheType '${type}' does not exist.`)
      return undefined
    }

    return { type: type as CacheType, value }
  }

  const [type, ...value] = key.split("/")
  return { type: type as CacheType, value: value.join("/") }
}
