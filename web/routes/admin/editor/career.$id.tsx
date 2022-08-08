import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"

import { AdminAppId, adminRegistry } from "@gs/admin"
import EditorPage from "@gs/admin/editor/EditorPage"
import { modifyDatabaseDocumentWithEditorForm } from "@gs/admin/editor/service.server"
import { adminLogger } from "@gs/admin/service.server"
import { type Model, type ModelName, getModelByModelName } from "@gs/models"
import type { CareerProps } from "@gs/models/career.model"
import { getCareerItem, getCareerModelName } from "@gs/models/career.server"
import { authenticateRoute } from "@gs/service/auth.server"
import invariant from "@gs/utils/invariant"

const adminApp = adminRegistry.getApp(AdminAppId.Editor)

interface LoaderData {
  item?: CareerProps
  model: Model
  modelName: ModelName
}

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request)
  const modelName = getCareerModelName()
  const model = getModelByModelName(modelName)

  const id = params.id
  invariant(id, modelName + " id is required.")

  if (id === "new") return json<LoaderData>({ model, modelName })

  try {
    const item = await getCareerItem(id, false, true)
    invariant(item, "Career item not found.")

    return json<LoaderData>({ item, model, modelName })
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
    getCareerModelName(),
    formData,
    request.method,
  )

  return redirect(redirectTo || pathname)
}

export default function CareerEditor(): JSX.Element | null {
  const { item, model, modelName } = useLoaderData<LoaderData>()

  return (
    <EditorPage
      item={item}
      model={model}
      basePreviewPath={modelName}
      headerPrefix={"Career"}
    />
  )
}
