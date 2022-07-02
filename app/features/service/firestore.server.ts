import {
  type DocumentData,
  type DocumentSnapshot,
  type Timestamp,
  getFirestore,
} from "firebase-admin/firestore"

import type { Gallery } from "~/features/types"

import { CacheType, createCacheKey, fetchCachedKey } from "./cache.server"

export enum FirestoreCollection {
  Projects = "projects",
  Blog = "blog",
  Info = "info",
  Testimonies = "testimonies",
  Education = "education",
  Career = "career",
  Users = "users",
}

// Getters

export async function getFirestoreCollection<T extends TransformedDocumentData>(
  collectionName: FirestoreCollection,
): Promise<T[]> {
  const key = createCacheKey(CacheType.FirestoreCollection, collectionName)

  return (await fetchCachedKey(key, () =>
    fetchFireStoreCollection(collectionName),
  )) as T[]
}

export async function getFirestoreDocument<T extends TransformedDocumentData>(
  collectionName: FirestoreCollection,
  docId: string,
): Promise<T> {
  const value = `${collectionName}/${docId}`
  const key = createCacheKey(CacheType.FirestoreDocument, value)

  const doc = await fetchCachedKey(key, () =>
    fetchFireStoreDocument(collectionName, docId),
  )
  if (!doc) throw new Error(`Document '${value}' not found`)

  return doc as T
}

// Fetchers

async function fetchFireStoreCollection(collectionPath: string) {
  verifyFirestoreCollection(collectionPath)
  const snapshot = await getFirestore().collection(collectionPath).get()

  return Promise.all((snapshot?.docs || []).map(docTransformer))
}

async function fetchFireStoreDocument(
  collectionPath: string,
  documentPath: string,
) {
  verifyFirestoreCollection(collectionPath)

  const doc = await getFirestore()
    .collection(collectionPath)
    .doc(documentPath)
    .get()

  return docTransformer(doc)
}

// Helpers

export { DocumentData }

function verifyFirestoreCollection(collectionPath: string) {
  if (
    !Object.values(FirestoreCollection).includes(
      collectionPath as FirestoreCollection,
    )
  ) {
    throw new Error(`FirestoreCollection '${collectionPath}' does not exist.`)
  }
}

async function docTransformer<T extends TransformedDocumentData>(
  doc?: DocumentSnapshot<T>,
): Promise<TransformedDocumentData> {
  if (!doc?.exists) throw new Error(`FirestoreDocument does not exist.`)

  const data = doc.data()
  if (!data) throw new Error(`FirestoreDocument is empty.`)

  return {
    id: doc.id,
    ...data,
    date: data?.date?.toDate?.()?.toISOString(),
    dateStart: data?.dateStart?.toDate?.()?.toISOString(),
    dateEnd: data?.dateEnd?.toDate?.()?.toISOString(),
  }
}

export interface BaseData {
  date?: Timestamp
  dateStart?: Timestamp
  dateEnd?: Timestamp
  icon?: string
  gallery?: Gallery
  content?: string
}

export type TransformedDocumentData = BaseData & DocumentData
