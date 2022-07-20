import {
  type DocumentData,
  type QueryDocumentSnapshot,
  type WriteResult,
  Timestamp,
} from "firebase-admin/firestore"
import invariant from "tiny-invariant"

export interface TransformedDocument {
  id: string
}

// Queries

export async function queryFireStoreCollection<T extends TransformedDocument>(
  collectionPath: string,
) {
  const collection = getFirestoreCollectionRef<T>(collectionPath)
  const snapshot = await collection.get()

  return snapshot?.docs.map((doc) => doc.data()) || []
}

export async function queryFireStoreDocument<T extends TransformedDocument>(
  collectionPath: string,
  documentPath: string,
): Promise<T> {
  const doc = getFirestoreDocumentRef<T>(collectionPath, documentPath)
  const data = (await doc.get()).data()
  // throws error if document does not exist in converter
  return data as T
}

export async function queryFireStoreCollectionIds(
  collectionPath: string,
): Promise<string[]> {
  const documentRefs = await getFirestoreCollectionRef(
    collectionPath,
  ).listDocuments()

  return documentRefs.map((doc) => doc.id)
}

// Mutations

export async function mutateFirestoreCollection<T extends TransformedDocument>(
  collectionPath: string,
  dataList?: Array<T>,
) {
  if (!dataList) {
    const documents = await getFirestoreCollectionRef(
      collectionPath,
    ).listDocuments()

    return Promise.all(
      documents.map((doc) => mutateFirestoreDocument(collectionPath, doc.id)),
    )
  }

  return Promise.all(
    dataList.map((data) =>
      mutateFirestoreDocument(collectionPath, data.id, data),
    ),
  )
}

export async function mutateFirestoreDocument<T extends TransformedDocument>(
  collectionPath: string,
  documentPath: string,
  data?: T,
): Promise<WriteResult> {
  const doc = getFirestoreDocumentRef(collectionPath, documentPath)

  if (data) return doc.set(data, { merge: true })
  return doc.delete()
}

// Helpers

function getFirestore() {
  return global.firestore
}

function getFirestoreCollectionRef<T extends TransformedDocument>(
  collectionPath: string,
) {
  return getFirestore().collection(collectionPath).withConverter<T>({
    toFirestore: transformToFirestoreSnapshot,
    fromFirestore: transformFromFirestoreSnapshot,
  })
}

function getFirestoreDocumentRef<T extends TransformedDocument>(
  collectionPath: string,
  documentPath: string,
) {
  return getFirestoreCollectionRef<T>(collectionPath).doc(documentPath)
}

function transformToFirestoreSnapshot<T extends TransformedDocument>(
  data: T,
): DocumentData {
  const modifiedDates = Object.entries(data).reduce((acc, [key, value]) => {
    if (!key.toLowerCase().includes("date") || !value) return acc

    return {
      ...acc,
      [key]: Timestamp.fromDate(new Date(value)),
    }
  }, {})

  return { ...data, ...modifiedDates }
}

function transformFromFirestoreSnapshot<T extends TransformedDocument>(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): T {
  invariant(
    snapshot?.exists,
    `FirestoreDocument ${snapshot.id} does not exist.`,
  )

  const data = snapshot.data()
  invariant(data, `FirestoreDocument ${snapshot.id} is empty.`)

  const modifiedDates = Object.entries(data).reduce((acc, [key, value]) => {
    if (!key.toLowerCase().includes("date") || !value) return acc

    return {
      ...acc,
      [key]: transformFirestoreTimestampToFormattedDate(value),
    }
  }, {} as Partial<TransformedDocument>)

  return { id: snapshot.id, ...data, ...modifiedDates } as T
}

function transformFirestoreTimestampToFormattedDate(
  date: Timestamp | string | undefined,
): string | undefined {
  if (!date) return undefined
  const jsDate = typeof date === "string" ? new Date(date) : date.toDate()

  return jsDate.toISOString()
}
