import { type DocumentData, getFirestore } from "firebase-admin/firestore"

import { docTransformer } from "~/packages/helpers/firestore-helpers.server"

import cache, { CacheType, createCacheKey } from "./cache.server"

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
): Promise<T> {
  const value = `${collectionName}/${docId}`
  const doc = await cache.fetch<T>(
    createCacheKey(CacheType.FirestoreDocument, value),
  )
  if (!doc) throw new Error(`Document '${value}' not found`)

  return doc
}

// Fetchers

export async function fetchFireStoreCollection(collectionPath: string) {
  verifyFirestoreCollection(collectionPath)
  const snapshot = await getFirestore().collection(collectionPath).get()

  return Promise.all(
    (snapshot?.docs || []).map((doc) => docTransformer(doc, false)),
  )
}

export async function fetchFireStoreDocument(path: string) {
  const [collectionPath, documentPath] = path.split("/")
  verifyFirestoreCollection(collectionPath)
  const doc = await getFirestore()
    .collection(collectionPath)
    .doc(documentPath)
    .get()

  return docTransformer(doc, true)
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

export { DocumentData }
