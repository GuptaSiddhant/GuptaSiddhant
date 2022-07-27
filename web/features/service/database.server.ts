import invariant from "tiny-invariant"

import {
  type TransformedDocument,
  mutateFirestoreDocument,
  queryFireStoreCollectionIds,
  queryFireStoreDocument,
} from "@gs/firebase/firestore"
import { DatabaseModel } from "@gs/models"

import {
  deleteCachedKey,
  deleteCachedKeysWith,
  fetchCachedKey,
} from "./cache.server"

export { DatabaseModel }
export type DatabaseDocument = TransformedDocument
export type DatabaseType<T extends DatabaseDocument> = Database<T>

const cacheKey = "database"
const cacheKeysKey = "::keys::"

export default class Database<T extends DatabaseDocument = DatabaseDocument> {
  #model: string

  constructor(model: DatabaseModel) {
    this.#model = model
  }

  get model() {
    return this.#model
  }

  #createCacheKey = (id?: string) =>
    [cacheKey, this.#model, id].filter(Boolean).join("/")

  invalidateCacheById = (id: string) =>
    deleteCachedKey(this.#createCacheKey(id))

  invalidateCacheAll = () => deleteCachedKeysWith(this.#createCacheKey())

  queryById = async <TypeOverride extends DatabaseDocument = T>(
    id: string,
    ignoreCache = false,
  ) => {
    if (ignoreCache) this.invalidateCacheById(id)

    return fetchCachedKey(this.#createCacheKey(id), () =>
      queryFireStoreDocument<TypeOverride>(this.#model, id),
    )
  }

  queryKeys = async (ignoreCache = false): Promise<string[]> => {
    if (ignoreCache) this.invalidateCacheById(cacheKeysKey)

    return fetchCachedKey(this.#createCacheKey(cacheKeysKey), () =>
      queryFireStoreCollectionIds(this.#model),
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
    return mutateFirestoreDocument(this.#model, id, data).then(() => {
      this.invalidateCacheById(id)
      this.invalidateCacheById(cacheKeysKey)
    })
  }

  static queryModelById<T extends DatabaseDocument>(model: string, id: string) {
    return new Database(validateDatabaseModel(model)).queryById<T>(id)
  }

  static queryModelAll<T extends DatabaseDocument>(model: string) {
    return new Database(validateDatabaseModel(model)).queryAll<T>()
  }

  static clearCache(model?: string) {
    if (!model) return deleteCachedKeysWith(cacheKey)
    return new Database(validateDatabaseModel(model)).invalidateCacheAll()
  }
}

// Helpers

function validateDatabaseModel(model: string) {
  invariant(
    Object.values(DatabaseModel).includes(model as DatabaseModel),
    `Invalid database model '${model}'`,
  )
  return model as DatabaseModel
}
