import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"

import EditorPage from "~/features/admin/editor/EditorPage"
import { modifyFirestoreDocumentWithEditorForm } from "~/features/admin/editor/service.server"
import { adminLogger } from "~/features/admin/service.server"
import { getModelByFirestoreCollection } from "~/features/experiences/helpers"
import type { EducationProps } from "~/features/experiences/types"
import type { Model } from "~/features/models"
import {
  FirestoreCollection,
  getFirestoreDocument,
} from "~/features/service/firestore.server"

import { handle } from "../editor"

interface LoaderData {
  item?: EducationProps
  model: Model
}

export const loader: LoaderFunction = async ({ params }) => {
  const collectionName = FirestoreCollection.Education
  const model = getModelByFirestoreCollection(collectionName)

  const id = params.id
  invariant(id, collectionName + " id is required.")

  if (id === "new") return json<LoaderData>({ model })

  try {
    const item = await getFirestoreDocument<EducationProps>(collectionName, id)
    return json<LoaderData>({ item, model })
  } catch (e: any) {
    adminLogger.error(e.message)
    return redirect(handle.adminApp.to + "/" + FirestoreCollection.Education)
  }
}

export const action: ActionFunction = async ({ request }) => {
  const { pathname } = new URL(request.url)
  const formData = await request.formData()

  const redirectTo = await modifyFirestoreDocumentWithEditorForm(
    FirestoreCollection.Education,
    formData,
    request.method,
  )

  return redirect(redirectTo || pathname)
}

export default function EducationEditor(): JSX.Element | null {
  const { item, model } = useLoaderData<LoaderData>()

  return <EditorPage item={item} model={model} headerPrefix="Education" />
}
