import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"

import AdminAppRegistry, { AdminAppId } from "~/features/admin"
import EditorPage from "~/features/admin/editor/EditorPage"
import { modifyDatabaseDocumentWithEditorForm } from "~/features/admin/editor/service.server"
import { adminLogger } from "~/features/admin/service.server"
import { getModelByDatabaseModel } from "~/features/experiences/helpers"
import { databaseCareer } from "~/features/experiences/service.server"
import type { CareerProps } from "~/features/experiences/types"
import type { Model } from "~/features/models"
import { authenticateRoute } from "~/features/service/auth.server"
import { DatabaseModel } from "~/features/service/database.server"

const adminApp = AdminAppRegistry.get(AdminAppId.Editor)

interface LoaderData {
  item?: CareerProps
  model: Model
}

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request)
  const collectionName = DatabaseModel.Career
  const model = getModelByDatabaseModel(collectionName)

  const id = params.id
  invariant(id, collectionName + " id is required.")

  if (id === "new") return json<LoaderData>({ model })

  try {
    const item = await databaseCareer.queryById(id)

    return json<LoaderData>({ item, model })
  } catch (e: any) {
    adminLogger.error(e.message)

    return redirect(adminApp.to + "/" + DatabaseModel.Career)
  }
}

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request)
  const { pathname } = new URL(request.url)
  const formData = await request.formData()

  const redirectTo = await modifyDatabaseDocumentWithEditorForm(
    databaseCareer,
    formData,
    request.method,
  )

  return redirect(redirectTo || pathname)
}

export default function CareerEditor(): JSX.Element | null {
  const { item, model } = useLoaderData<LoaderData>()

  return <EditorPage item={item} model={model} headerPrefix={"Career"} />
}
