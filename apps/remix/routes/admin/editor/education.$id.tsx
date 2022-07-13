import { AdminAppId, adminRegistry } from "@features/admin"
import EditorPage from "@features/admin/editor/EditorPage"
import { modifyDatabaseDocumentWithEditorForm } from "@features/admin/editor/service.server"
import { adminLogger } from "@features/admin/service.server"
import { getModelByDatabaseModel } from "@features/experiences/helpers"
import { databaseEducation } from "@features/experiences/service.server"
import type { EducationProps } from "@features/experiences/types"
import type { Model } from "@features/models"
import { authenticateRoute } from "@features/service/auth.server"
import { DatabaseModel } from "@features/service/database.server"
import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"

const adminApp = adminRegistry.getApp(AdminAppId.Editor)

interface LoaderData {
  item?: EducationProps
  model: Model
}

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request)
  const collectionName = DatabaseModel.Education
  const model = getModelByDatabaseModel(collectionName)

  const id = params.id
  invariant(id, collectionName + " id is required.")

  if (id === "new") return json<LoaderData>({ model })

  try {
    const item = await databaseEducation.queryById(id, true)

    return json<LoaderData>({ item, model })
  } catch (e: any) {
    adminLogger.error(e.message)

    return redirect(adminApp.linkPath + "/" + DatabaseModel.Education)
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

  return <EditorPage item={item} model={model} headerPrefix="Education" />
}
