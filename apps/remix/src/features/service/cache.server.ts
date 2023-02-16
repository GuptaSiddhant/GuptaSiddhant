import LRUCache, { type Options } from "lru-cache";

import { ONE_DAY_IN_MS } from "@gs/constants";

import Logger from "./logger.server";

const logger = new Logger("Cache");

declare global {
  // rome-ignore lint/nursery/noVar: Global declaration
  var appCache: LRUCache<string, unknown>;
}

const appCache =
  global.appCache ||
  (global.appCache = new LRUCache<string, unknown>({
    max: 300,
    allowStale: true,
    ttl: Number.parseInt(process.env?.CACHE_TTL || "0", 10) || ONE_DAY_IN_MS,
  }));

type CacheKey = string | string[];

// Utils

export function getCache() {
  return appCache;
}

export function getCachedKeys(): string[] {
  return [...getCache().keys()];
}

export function getCachedTypes(): string[] {
  return [...new Set(getCachedKeys().map((key) => parseCacheKey(key).type))];
}

export function hasCachedKey(key: CacheKey): boolean {
  return getCache().has(normaliseCacheKey(key));
}

export function getCachedKey(key: CacheKey) {
  const cache = getCache();
  const _key = normaliseCacheKey(key);

  if (cache.has(_key)) {
    return cache.get(_key);
  }
}

export async function fetchCachedKey<T>(
  key: CacheKey,
  fn: () => Promise<T>,
  options?: Options<string, unknown>,
): Promise<T> {
  const cache = getCache();
  const _key = normaliseCacheKey(key);

  if (cache.has(_key)) {
    return cache.get(_key) as T;
  }

  logger.info(`Fetching: ${_key}`);
  const result = await fn();

  cache.set(_key, result, options);

  return result;
}

export enum ModifyCacheMethod {
  DELETE = "DELETE",
}

export async function modifyCache(method: ModifyCacheMethod, key?: CacheKey) {
  switch (method) {
    case ModifyCacheMethod.DELETE: {
      if (key) {
        return deleteCachedKeysWith(key);
      } else {
        return clearCache();
      }
    }
  }
}

export function deleteCachedKeysWith(key: CacheKey) {
  const _key = normaliseCacheKey(key);

  return getCachedKeys()
    .filter((k) => k.includes(_key))
    .forEach(deleteCachedKey);
}

export function deleteCachedKey(key: CacheKey) {
  const _key = normaliseCacheKey(key);
  logger.notice(`Deleted: ${_key}`);

  return getCache().delete(_key);
}

export function clearCache() {
  logger.notice("Cleared");

  return getCache().clear();
}

export function createCacheKey(type: string, value: string) {
  return [type, value].filter(Boolean).join("::");
}

export function parseCacheKey(key: CacheKey): { type: string; value: string } {
  const _key = normaliseCacheKey(key);
  const [type, ...value] = _key.split("/");

  return { type, value: value.join("/") };
}

function normaliseCacheKey(key: CacheKey): string {
  return typeof key === "string" ? key : key.join("/");
}
