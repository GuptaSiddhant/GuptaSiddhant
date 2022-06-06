import {
  getFirestore,
  type Timestamp,
  type DocumentSnapshot,
  type DocumentData,
} from "firebase-admin/firestore"
import type { Gallery, TeaserProps } from "@gs/types"

import cache, { createCacheKey, CacheType } from "./cache.server"
import { getFirebaseStorageFileUrl } from "./storage.server"

export enum FirestoreCollection {
  Projects = "projects",
  Blog = "blog",
  Info = "info",
  Testimonies = "testimonies",
  Education = "education",
  Career = "career",
}

// Getters

export async function getFirestoreCollection<T = DocumentData>(
  collectionName: FirestoreCollection,
): Promise<T[] | undefined> {
  return cache.fetch<T[]>(
    createCacheKey(CacheType.FirestoreCollection, collectionName),
  )
}

export async function getFirestoreDocument<T = DocumentData>(
  collectionName: FirestoreCollection,
  docId: string,
): Promise<T | undefined> {
  return cache.fetch<T>(
    createCacheKey(CacheType.FirestoreDocument, `${collectionName}/${docId}`),
  )
}

// Fetchers

export async function fetchFireStoreCollection(collectionPath: string) {
  verifyFirestoreCollection(collectionPath)
  const snapshot = await getFirestore().collection(collectionPath).get()

  return Promise.all((snapshot?.docs || []).map(docTransformer))
}

export async function fetchFireStoreDocument(path: string) {
  const [collectionPath, documentPath] = path.split("/")
  verifyFirestoreCollection(collectionPath)
  const doc = await getFirestore()
    .collection(collectionPath)
    .doc(documentPath)
    .get()

  return docTransformer(doc)
}

// Helpers

function verifyFirestoreCollection(collectionPath: string) {
  if (
    !Object.values(FirestoreCollection).includes(
      collectionPath as FirestoreCollection,
    )
  ) {
    throw new Error(`FirestoreCollection '${collectionPath}' does not exist.`)
  }
}

async function docTransformer<T extends DocumentData & DummyData>(
  doc?: DocumentSnapshot<T>,
): Promise<T> {
  if (!doc?.exists) throw new Error(`FirestoreDocument does not exist.`)

  const data = doc.data()
  if (!data) throw new Error(`FirestoreDocument is empty.`)

  const gallery = await Promise.all(
    (data?.gallery || []).map(async (i) => ({
      ...i,
      url: await toImageUrl(i.url),
    })),
  )

  return {
    id: doc.id,
    ...data,
    date: data?.date?.toDate?.().toString(),
    dateStart: data?.dateStart?.toDate?.().toString(),
    dateEnd: data?.dateEnd?.toDate?.().toString(),
    gallery,
    cover: gallery?.[0]?.url,
  }
}

interface DummyData {
  date?: Timestamp
  dateStart?: Timestamp
  dateEnd?: Timestamp
  icon?: string
  gallery?: Gallery
}

async function toImageUrl(path: string) {
  if (path.startsWith("/") || path.startsWith("http")) return path
  try {
    return getFirebaseStorageFileUrl(path)
  } catch {
    return path
  }
}
