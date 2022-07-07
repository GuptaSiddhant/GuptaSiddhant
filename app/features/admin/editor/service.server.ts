import invariant from "tiny-invariant"

import { getModelByFirestoreCollection } from "~/features/experiences/helpers"
import { getDataFromModelObject } from "~/features/models/helpers"
import {
  type FirestoreCollection,
  deleteFirestoreDocument,
  getFirestoreDocument,
  setFirestoreDocument,
} from "~/features/service/firestore.server"

export async function getItemAndModelForFirebaseCollection<T>(
  collectionName: FirestoreCollection,
  id: string,
) {
  const item = await getFirestoreDocument<T>(collectionName, id)
  const model = getModelByFirestoreCollection(collectionName)

  return { item, model }
}

export async function modifyFirestoreDocumentWithEditorForm(
  collectionName: FirestoreCollection,
  formData: FormData,
  method: string,
): Promise<string | undefined> {
  const docId = formData.get("id")?.toString()
  invariant(docId, collectionName + " id is required.")

  if (method === "POST" || method === "PUT") {
    await setFirestoreDocumentWithEditorForm(
      collectionName,
      docId,
      formData,
      method,
    )
    return generateRedirectUrl(`${collectionName}/${docId}`)
  }

  if (method === "DELETE") {
    await deleteFirestoreDocument(collectionName, docId)
    return generateRedirectUrl(collectionName)
  }

  return
}

export async function setFirestoreDocumentWithEditorForm(
  collectionName: FirestoreCollection,
  docId: string,
  formData: FormData,
  method: string,
) {
  const model = getModelByFirestoreCollection(collectionName)

  const data = getDataFromModelObject(
    Object.keys(model.properties),
    formData,
    model.properties,
  )

  return setFirestoreDocument(collectionName, docId, data, method === "POST")
}

// Helper

function generateRedirectUrl(path?: string) {
  const basePath = "/admin/editor"
  if (!path) return `${basePath}/`
  if (path.startsWith("/")) return `${basePath}${path}`
  return `${basePath}/${path}`
}
