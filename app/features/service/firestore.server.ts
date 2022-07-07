import {
  type DocumentData,
  type DocumentSnapshot,
  Timestamp,
} from "firebase-admin/firestore"

import type { Gallery } from "~/features/types"

import { formatYYYYMMDD } from "../helpers/format"
import {
  CacheType,
  createCacheKey,
  deleteCachedKey,
  fetchCachedKey,
} from "./cache.server"

export enum FirestoreCollection {
  Projects = "projects",
  Blog = "blog",
  Info = "info",
  Testimonies = "testimonies",
  Education = "education",
  Career = "career",
  Users = "users",
}

const firestore = global.firestore

// Getters

export async function getFirestoreCollection<T extends FirestoreDocumentData>(
  collectionName: FirestoreCollection,
): Promise<T[]> {
  const key = createCacheKey(CacheType.FirestoreCollection, collectionName)

  return (await fetchCachedKey(key, () =>
    fetchFireStoreCollection(collectionName),
  )) as T[]
}

export async function getFirestoreDocument<T>(
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

async function fetchFireStoreCollection(collectionPath: FirestoreCollection) {
  verifyFirestoreCollection(collectionPath)
  const snapshot = await firestore.collection(collectionPath).get()

  return (snapshot?.docs || []).map(transformFirestoreDocToLocalData)
}

async function fetchFireStoreDocument(
  collectionPath: string,
  documentPath: string,
) {
  verifyFirestoreCollection(collectionPath)

  const doc = await firestore.collection(collectionPath).doc(documentPath).get()

  return transformFirestoreDocToLocalData(doc)
}

// Setters

export async function setFirestoreDocument<T extends BaseLocalData>(
  collectionPath: FirestoreCollection,
  docId: string,
  data: T,
) {
  return firestore
    .collection(collectionPath)
    .doc(docId)
    .set(transformLocalDataToFirestoreDoc(data), { merge: true })
    .then(() => {
      deleteCachedKey(
        createCacheKey(
          CacheType.FirestoreDocument,
          `${collectionPath}/${docId}`,
        ),
      )
    })
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

function transformFirestoreDocToLocalData<T extends FirestoreDocumentData>(
  doc?: DocumentSnapshot<T>,
): FirestoreDocumentData {
  if (!doc?.exists) throw new Error(`FirestoreDocument does not exist.`)

  const data = doc.data()
  if (!data) throw new Error(`FirestoreDocument is empty.`)

  return {
    id: doc.id,
    ...data,
    date: formatYYYYMMDD(
      transformFirestoreTimestampToFormattedDate(data?.date),
    ),
    dateStart: formatYYYYMMDD(
      transformFirestoreTimestampToFormattedDate(data?.dateStart),
    ),
    dateEnd: formatYYYYMMDD(
      transformFirestoreTimestampToFormattedDate(data?.dateEnd),
    ),
    startDate: formatYYYYMMDD(
      transformFirestoreTimestampToFormattedDate(data?.startDate),
    ),
    endDate: formatYYYYMMDD(
      transformFirestoreTimestampToFormattedDate(data?.endDate),
    ),
  }
}

function transformFirestoreTimestampToFormattedDate(
  date: Timestamp | string | undefined,
): Date | undefined {
  if (!date) return undefined
  if (typeof date === "string") return new Date(date)
  return date.toDate()
}

function transformLocalDataToFirestoreDoc<T extends BaseLocalData>(
  data: T,
): FirestoreDocumentData {
  const date = data?.date ? Timestamp.fromDate(new Date(data.date)) : undefined
  const dateStart = data?.dateStart
    ? Timestamp.fromDate(new Date(data.dateStart))
    : undefined
  const dateEnd = data?.dateEnd
    ? Timestamp.fromDate(new Date(data.dateEnd))
    : undefined
  const startDate = data?.startDate
    ? Timestamp.fromDate(new Date(data.startDate))
    : undefined
  const endDate = data?.endDate
    ? Timestamp.fromDate(new Date(data.endDate))
    : undefined

  return {
    ...data,
    date,
    dateStart,
    dateEnd,
    startDate,
    endDate,
  }
}

export interface BaseFirestoreData {
  date?: Timestamp
  dateStart?: Timestamp
  dateEnd?: Timestamp
  startDate?: Timestamp
  endDate?: Timestamp
  icon?: string
  gallery?: Gallery
  content?: string
}
export interface BaseLocalData {
  date?: string
  dateStart?: string
  dateEnd?: string
  startDate?: string
  endDate?: string
  icon?: string
  gallery?: Gallery
  content?: string
}

export type FirestoreDocumentData = BaseFirestoreData & DocumentData
