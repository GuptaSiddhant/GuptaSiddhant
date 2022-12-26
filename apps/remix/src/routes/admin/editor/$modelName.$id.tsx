import { useLoaderData } from "@remix-run/react"
import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"

import { AdminAppId, adminRegistry } from "@gs/admin"
import EditorPage from "@gs/admin/editor/EditorPage"
import { adminLogger } from "@gs/admin/service.server"
import {
  type Model,
  getLabelByModelName,
  getModelByModelName,
  ModelName,
  verifyValidModelName,
} from "@gs/models"
import { getProjectAssociationKeys } from "@gs/models/projects/index.server"
import {
  getItemByModelName,
  mutateDatabaseByModelNameAndFormData,
} from "@gs/models/service.server"
import {
  authenticateRoute,
  isUserHasWriteAccess,
} from "@gs/service/auth.server"
import Database from "@gs/service/database.server"
import invariant from "@gs/utils/invariant"

const adminApp = adminRegistry.getApp(AdminAppId.Editor)

interface LoaderData {
  item?: any
  model: Model
  modelName: ModelName
  modelLabel: string
  hasWriteAccess: boolean
}

export async function loader({ params, request }: DataFunctionArgs) {
  const user = await authenticateRoute(request)
  const hasWriteAccess = await isUserHasWriteAccess(user)

  const { modelName: name, id } = params
  invariant(name, "ModelName is required.")
  invariant(verifyValidModelName(name), `ModelName ${name} is invalid.`)
  invariant(id, `${name} id is required.`)

  const modelName = name as ModelName
  const modelLabel = getLabelByModelName(modelName)
  const model = getModelByModelName(modelName)

  if (id === "new")
    return json<LoaderData>({ model, modelName, modelLabel, hasWriteAccess })

  try {
    const item = await getItemByModelName(modelName, id)
    invariant(item, `${modelLabel} item not found.`)

    const enrichedModel = await enrichModel(modelName, model)

    return json<LoaderData>({
      item,
      model: enrichedModel,
      modelLabel,
      modelName,
      hasWriteAccess,
    })
  } catch (e: any) {
    adminLogger.error(e.message)

    return redirect(adminApp.linkPath + modelName)
  }
}

export async function action({ request, params }: DataFunctionArgs) {
  const user = await authenticateRoute(request)
  invariant(
    await isUserHasWriteAccess(user),
    `The user '${user.email}' does not have write-access.`,
  )

  const { pathname } = new URL(request.url)
  const formData = await request.formData()

  const { modelName: name } = params
  invariant(name, "ModelName is required.")
  const modelName = name as ModelName

  const id = formData.get("id")?.toString()
  invariant(id, modelName + " id is required.")

  const database = new Database(modelName)

  if (request.method === "DELETE") {
    const deleted = await database.mutateById(id)
    return redirect(generateRedirectUrl(modelName, deleted ? "" : id))
  }

  await mutateDatabaseByModelNameAndFormData(modelName, formData, database, id)

  return redirect(generateRedirectUrl(modelName, id) || pathname)
}

export default function Editor(): JSX.Element | null {
  const { item, model, modelName, modelLabel, hasWriteAccess } =
    useLoaderData<LoaderData>()

  return (
    <EditorPage
      item={item}
      model={model}
      basePreviewPath={modelName}
      headerPrefix={modelLabel}
      readonly={!hasWriteAccess}
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

function generateRedirectUrl(...paths: string[]) {
  return ["/admin/editor", ...paths].join("/")
}
