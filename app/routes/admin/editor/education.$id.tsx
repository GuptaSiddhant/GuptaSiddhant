import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"

import EditorPage from "~/features/admin/editor/EditorPage"
import { getEducationModel } from "~/features/experiences/helpers"
import type { EducationProps } from "~/features/experiences/types"
import type { Model } from "~/features/models"
import { getDataFromModelObject } from "~/features/models/helpers"
import {
  FirestoreCollection,
  getFirestoreDocument,
  setFirestoreDocument,
} from "~/features/service/firestore.server"

interface LoaderData {
  item: EducationProps
  model: Model<keyof EducationProps>
}

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id
  invariant(id, "Education id is required")

  const item = await getFirestoreDocument<EducationProps>(
    FirestoreCollection.Education,
    id,
  )

  const educationModel = getEducationModel()

  return json<LoaderData>({ item, model: educationModel })
}

export const action: ActionFunction = async ({ request }) => {
  const { pathname } = new URL(request.url)
  const formData = await request.formData()

  const id = formData.get("id")?.toString()
  invariant(id, "Education id is required")

  const educationModel = getEducationModel()

  const data = getDataFromModelObject(
    Object.keys(educationModel.properties),
    formData,
    educationModel.properties,
  )

  await setFirestoreDocument(FirestoreCollection.Education, id, data)

  return redirect(pathname)
}

export default function EducationEditor(): JSX.Element | null {
  const { item, model } = useLoaderData<LoaderData>()

  return <EditorPage item={item} model={model} />
}
