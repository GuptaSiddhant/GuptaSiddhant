import {
  getFirestore,
  type Firestore,
  type QuerySnapshot,
  type DocumentSnapshot,
  type DocumentData,
} from "firebase-admin/firestore"
import LRUCache from "lru-cache"

export enum CacheType {
  FirestoreCollection = "firestoreCollection",
  FirestoreDocument = "firestoreDocument",
}

export enum FirestoreCollection {
  Projects = "projects",
  Blog = "blog",
  Info = "info",
  Testimonies = "testimonies",
  Education = "education",
  Career = "career",
}

const _1_DAY_IN_MS_ = 1_000 * 60 * 60 * 24
const cacheTtlInMs =
  Number.parseInt(process.env?.CACHE_TTL || "0", 10) || _1_DAY_IN_MS_

export const cache =
  global.cache ||
  (global.cache = new LRUCache<string, Firestore>({
    max: 100,
    ttl: cacheTtlInMs,
    fetchMethod,
  }))

export async function readCollection<T = DocumentData>(
  collection: FirestoreCollection,
): Promise<T[]> {
  const snapshot = await cache.fetch<QuerySnapshot<T>>(
    createKey(CacheType.FirestoreCollection, collection),
  )

  return (snapshot?.docs || []).map((doc) => doc.data())
}

export async function readDocument<T = DocumentData>(
  collection: FirestoreCollection,
  docId: string,
): Promise<T> {
  const doc = await cache.fetch<DocumentSnapshot<T>>(
    createKey(CacheType.FirestoreDocument, `${collection}/${docId}`),
  )
  if (!doc?.exists)
    throw new Error(`Document '${collection}/${docId}' does not exist.`)

  const data = doc.data()
  if (!data) throw new Error(`Document '${collection}/${docId}' is empty.`)

  return data
}

// Helpers
const keySeparator = "---"

function createKey(type: CacheType, value: string) {
  return [type, value].join(keySeparator)
}

async function fetchMethod(key: string): Promise<any> {
  logCache("Fetching:", key)
  const [type, path] = key.split(keySeparator)
  const db = getFirestore()

  switch (type) {
    case CacheType.FirestoreCollection: {
      return await db.collection(path).get()
    }
    case CacheType.FirestoreDocument: {
      const [collection, docId] = path.split("/")
      return await db.collection(collection).doc(docId).get()
    }
    default:
      return undefined
  }
}

export function logCache(...message: any[]) {
  console.log("[Cache]", ...message)
}
