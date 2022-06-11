import LRUCache from "lru-cache"

import { ONE_DAY_IN_MS } from "~/packages/constants"

import {
  fetchFireStoreCollection,
  fetchFireStoreDocument,
} from "./firestore.server"
import { fetchRemoteConfig } from "./remote-config.server"
import { fetchFirebaseStorageFileUrl } from "./storage.server"

const cacheKeySeparator = "---"

export enum CacheType {
  FirestoreCollection = "collection",
  FirestoreDocument = "document",
  FirebaseStorageFileUrl = "storage-file-url",
  RemoteConfig = "remote-config",
}

const cacheFetchMethod: Record<CacheType, (value: string) => Promise<any>> = {
  [CacheType.FirestoreCollection]: fetchFireStoreCollection,
  [CacheType.FirestoreDocument]: fetchFireStoreDocument,
  [CacheType.FirebaseStorageFileUrl]: fetchFirebaseStorageFileUrl,
  [CacheType.RemoteConfig]: fetchRemoteConfig,
}

const cache =
  global.cache ||
  (global.cache = new LRUCache<string, any>({
    max: 100,
    allowStale: true,
    ttl: Number.parseInt(process.env?.CACHE_TTL || "0", 10) || ONE_DAY_IN_MS,
    fetchMethod: (key) => {
      const [type, value] = key.split(cacheKeySeparator)
      if (!Object.values(CacheType).includes(type as CacheType)) {
        console.error(`CacheType '${type}' does not exist.`)
        return undefined
      }

      logCache("Fetching:", key)
      return cacheFetchMethod[type as CacheType](value)
    },
  }))

export default cache

export function createCacheKey(type: CacheType, value?: string) {
  return [type, value].filter(Boolean).join(cacheKeySeparator)
}

export function logCache(...message: any[]) {
  console.log("[Cache]", ...message)
}
