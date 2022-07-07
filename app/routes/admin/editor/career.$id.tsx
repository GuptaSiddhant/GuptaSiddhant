import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"

import EditorPage from "~/features/admin/editor/EditorPage"
import { getCareerModel } from "~/features/experiences/helpers"
import type { CareerProps } from "~/features/experiences/types"
import type { Model } from "~/features/models"
import { getDataFromModelObject } from "~/features/models/helpers"
import {
  FirestoreCollection,
  getFirestoreDocument,
  setFirestoreDocument,
} from "~/features/service/firestore.server"

interface LoaderData {
  item: CareerProps
  model: Model<keyof CareerProps>
}

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id
  invariant(id, "Career id is required")

  const item = await getFirestoreDocument<CareerProps>(
    FirestoreCollection.Career,
    id,
  )

  const educationModel = getCareerModel()

  return json<LoaderData>({ item, model: educationModel })
}

export const action: ActionFunction = async ({ request }) => {
  const { pathname } = new URL(request.url)
  const formData = await request.formData()

  const id = formData.get("id")?.toString()
  invariant(id, "Career id is required")

  const educationModel = getCareerModel()

  const data = getDataFromModelObject(
    Object.keys(educationModel.properties),
    formData,
    educationModel.properties,
  )

  await setFirestoreDocument(FirestoreCollection.Career, id, data)

  return redirect(pathname)
}

export default function CareerEditor(): JSX.Element | null {
  const { item, model } = useLoaderData<LoaderData>()

  return <EditorPage item={item} model={model} />
}
