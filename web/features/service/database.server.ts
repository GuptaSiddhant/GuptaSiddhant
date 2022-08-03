import invariant from "@gs/utils/invariant"

import {
  type TransformedDocument,
  mutateFirestoreDocument,
  queryFireStoreCollectionIds,
  queryFireStoreDocument,
} from "@gs/firebase/firestore"
import { ModelName } from "@gs/models"

import {
  deleteCachedKey,
  deleteCachedKeysWith,
  fetchCachedKey,
} from "./cache.server"

export { ModelName }
export type DatabaseDocument = TransformedDocument
export type DatabaseType<T extends DatabaseDocument> = Database<T>

const cacheKey = "database"
const cacheKeysKey = "::keys::"

export default class Database<T extends DatabaseDocument = DatabaseDocument> {
  #modelName: string

  constructor(modelName: ModelName) {
    this.#modelName = modelName
  }

  get model() {
    return this.#modelName
  }

  #createCacheKey = (id?: string) =>
    [cacheKey, this.#modelName, id].filter(Boolean).join("/")

  #invalidateIndexKey = () =>
    deleteCachedKey([cacheKey, ModelName.Index, this.#modelName].join("/"))

  invalidateCacheById = (id: string) => {
    deleteCachedKey(this.#createCacheKey(id))
    this.#invalidateIndexKey()
  }

  invalidateCacheAll = () => {
    this.#invalidateIndexKey()
    deleteCachedKeysWith(this.#createCacheKey())
  }

  queryById = async <TypeOverride extends DatabaseDocument = T>(
    id: string,
    ignoreCache = false,
  ) => {
    if (ignoreCache) this.invalidateCacheById(id)

    return fetchCachedKey(this.#createCacheKey(id), () =>
      queryFireStoreDocument<TypeOverride>(this.#modelName, id),
    )
  }

  queryKeys = async (ignoreCache = false): Promise<string[]> => {
    if (ignoreCache) this.invalidateCacheById(cacheKeysKey)

    return fetchCachedKey(this.#createCacheKey(cacheKeysKey), () =>
      queryFireStoreCollectionIds(this.#modelName),
    )
  }

  queryAll = async <TypeOverride extends DatabaseDocument = T>(
    ignoreCache = false,
  ) => {
    const keys = await this.queryKeys(ignoreCache)

    return Promise.all(
      keys.map((id) => this.queryById<TypeOverride>(id, ignoreCache)),
    )
  }

  mutateById = async (id: string, data?: T) => {
    return mutateFirestoreDocument(this.#modelName, id, data).then((res) => {
      this.invalidateCacheById(id)
      this.invalidateCacheById(cacheKeysKey)
      return res
    })
  }

  static queryModelById<T extends DatabaseDocument>(model: string, id: string) {
    return new Database(validateModelName(model)).queryById<T>(id)
  }

  static queryModelAll<T extends DatabaseDocument>(model: string) {
    return new Database(validateModelName(model)).queryAll<T>()
  }

  static clearCache(model?: string) {
    if (!model) return deleteCachedKeysWith(cacheKey)
    return new Database(validateModelName(model)).invalidateCacheAll()
  }
}

// Helpers

function validateModelName(model: string) {
  invariant(
    Object.values(ModelName).includes(model as ModelName),
    `Invalid database model '${model}'`,
  )
  return model as ModelName
}
