import { useLoaderData } from "@remix-run/react"
import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"

import { AdminAppId, adminRegistry } from "@gs/admin"
import EditorPage from "@gs/admin/editor/EditorPage"
import { modifyDatabaseDocumentWithEditorForm } from "@gs/admin/editor/service.server"
import { adminLogger } from "@gs/admin/service.server"
import {
  type Model,
  getLabelByModelName,
  getModelByModelName,
  ModelName,
  verifyValidModelName,
} from "@gs/models"
import { getItemByModelName } from "@gs/models/index.server"
import { getProjectAssociationKeys } from "@gs/models/projects.server"
import { authenticateRoute } from "@gs/service/auth.server"
import invariant from "@gs/utils/invariant"

const adminApp = adminRegistry.getApp(AdminAppId.Editor)

interface LoaderData {
  item?: any
  model: Model
  modelName: ModelName
  modelLabel: string
}

export async function loader({ params, request }: DataFunctionArgs) {
  await authenticateRoute(request)

  const { modelName: name, id } = params
  invariant(name, "ModelName is required.")
  invariant(verifyValidModelName(name), `ModelName ${name} is invalid.`)
  invariant(id, `${name} id is required.`)

  const modelName = name as ModelName
  const modelLabel = getLabelByModelName(modelName)
  const model = getModelByModelName(modelName)

  if (id === "new") return json<LoaderData>({ model, modelName, modelLabel })

  try {
    const item = await getItemByModelName(modelName, id)
    invariant(item, `${modelLabel} item not found.`)

    const enrichedModel = await enrichModel(modelName, model)

    return json<LoaderData>({
      item,
      model: enrichedModel,
      modelLabel,
      modelName,
    })
  } catch (e: any) {
    adminLogger.error(e.message)

    return redirect(adminApp.linkPath + modelName)
  }
}

export async function action({ request, params }: DataFunctionArgs) {
  await authenticateRoute(request)

  const { modelName: name } = params
  invariant(name, "ModelName is required.")

  const { pathname } = new URL(request.url)
  const formData = await request.formData()

  const modelName = name as ModelName
  const redirectTo = await modifyDatabaseDocumentWithEditorForm(
    modelName,
    formData,
    request.method,
  )

  return redirect(redirectTo || pathname)
}

export default function ItemEditor(): JSX.Element | null {
  const { item, model, modelName, modelLabel } = useLoaderData<LoaderData>()

  return (
    <EditorPage
      item={item}
      model={model}
      basePreviewPath={modelName}
      headerPrefix={modelLabel}
    />
  )
}

// Helpers

async function enrichModel(modelName: ModelName, model: Model): Promise<Model> {
  if (modelName === ModelName.Projects) {
    const assocKeys = await getProjectAssociationKeys()

    if (model.type === "object") {
      // Add options to association property
      model.properties["association"] = {
        ...(model.properties["association"] || {}),
        type: "string",
        enum: ["", ...assocKeys],
      }
    }
  }

  return model
}
