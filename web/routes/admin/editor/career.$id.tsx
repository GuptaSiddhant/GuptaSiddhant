import invariant from "tiny-invariant"

import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"

import { AdminAppId, adminRegistry } from "@gs/admin"
import EditorPage from "@gs/admin/editor/EditorPage"
import { modifyDatabaseDocumentWithEditorForm } from "@gs/admin/editor/service.server"
import { adminLogger } from "@gs/admin/service.server"
import { type Model, getModelByModelName } from "@gs/models"
import type { CareerProps } from "@gs/models/career.model"
import { getCareerItem } from "@gs/models/career.server"
import { authenticateRoute } from "@gs/service/auth.server"
import { ModelName } from "@gs/service/database.server"

const adminApp = adminRegistry.getApp(AdminAppId.Editor)

interface LoaderData {
  item?: CareerProps
  model: Model
}

const modelName = ModelName.Career

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request)
  const model = getModelByModelName(modelName)

  const id = params.id
  invariant(id, modelName + " id is required.")

  if (id === "new") return json<LoaderData>({ model })

  try {
    const item = await getCareerItem(id, false, true)
    invariant(item, "Career item not found.")

    return json<LoaderData>({ item, model })
  } catch (e: any) {
    adminLogger.error(e.message)

    return redirect(adminApp.linkPath + modelName)
  }
}

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request)
  const { pathname } = new URL(request.url)
  const formData = await request.formData()

  const redirectTo = await modifyDatabaseDocumentWithEditorForm(
    modelName,
    formData,
    request.method,
  )

  return redirect(redirectTo || pathname)
}

export default function CareerEditor(): JSX.Element | null {
  const { item, model } = useLoaderData<LoaderData>()

  return (
    <EditorPage
      item={item}
      model={model}
      headerPrefix={"Career"}
      basePreviewPath="about"
    />
  )
}
