import { getFirestore, type DocumentData } from "firebase-admin/firestore"

import cache, { createCacheKey, CacheType } from "./cache.server"
import { docTransformer } from "@gs/helpers/firestore-helpers.server"

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
