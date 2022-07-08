import {
  type TransformedDocument,
  getFirestoreCollectionRef,
  mutateFirestoreDocument,
  queryFireStoreDocument,
} from "@gs/firebase/firestore"
import invariant from "tiny-invariant"

import {
  deleteCachedKey,
  deleteCachedKeysWith,
  fetchCachedKey,
} from "./cache.server"

export enum DatabaseModel {
  Projects = "projects",
  Blog = "blog",
  Info = "info",
  Testimonies = "testimonies",
  Education = "education",
  Career = "career",
  Users = "users",
}

export type DatabaseDocument = TransformedDocument
export type DatabaseType<T extends DatabaseDocument> = Database<T>

const cacheKey = "database"

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

  queryAll = async <TypeOverride extends DatabaseDocument = T>(
    ignoreCache = false,
  ) => {
    const docsRefs = await getFirestoreCollectionRef<TypeOverride>(
      this.#model,
    ).listDocuments()

    return Promise.all(
      docsRefs.map((doc) => this.queryById(doc.id, ignoreCache)),
    )
  }

  mutateById = async (id: string, data?: T) => {
    return mutateFirestoreDocument(this.#model, id, data).then(() =>
      this.invalidateCacheById(id),
    )
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
