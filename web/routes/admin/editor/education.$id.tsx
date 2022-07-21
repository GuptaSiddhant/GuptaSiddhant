import invariant from "tiny-invariant"

import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { json,redirect  } from "@remix-run/server-runtime"

import { AdminAppId, adminRegistry } from "@gs/admin"
import EditorPage from "@gs/admin/editor/EditorPage"
import { modifyDatabaseDocumentWithEditorForm } from "@gs/admin/editor/service.server"
import { adminLogger } from "@gs/admin/service.server"
import { databaseEducation } from "@gs/experiences/service.server"
import type { EducationProps } from "@gs/experiences/types"
import { type Model, getModelByDatabaseModel } from "@gs/models"
import { authenticateRoute } from "@gs/service/auth.server"
import { DatabaseModel } from "@gs/service/database.server"

const adminApp = adminRegistry.getApp(AdminAppId.Editor)

interface LoaderData {
  item?: EducationProps
  model: Model
}

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request)
  const modelName = DatabaseModel.Education
  const model = getModelByDatabaseModel(modelName)

  const id = params.id
  invariant(id, modelName + " id is required.")

  if (id === "new") return json<LoaderData>({ model })

  try {
    const item = await databaseEducation.queryById(id, true)
    invariant(item, "Education item not found.")

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
    databaseEducation,
    formData,
    request.method,
  )

  return redirect(redirectTo || pathname)
}

export default function EducationEditor(): JSX.Element | null {
  const { item, model } = useLoaderData<LoaderData>()

  return (
    <EditorPage
      item={item}
      model={model}
      headerPrefix="Education"
      basePreviewPath="about"
    />
  )
}
