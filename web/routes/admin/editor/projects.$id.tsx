import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"

import { AdminAppId, adminRegistry } from "@gs/admin"
import EditorPage from "@gs/admin/editor/EditorPage"
import { modifyDatabaseDocumentWithEditorForm } from "@gs/admin/editor/service.server"
import { adminLogger } from "@gs/admin/service.server"
import { type Model, type ModelName, getModelByModelName } from "@gs/models"
import { getCareerKeys } from "@gs/models/career.server"
import { getEducationKeys } from "@gs/models/education.server"
import {
  type ProjectProps,
  getProject,
  getProjectsModelName,
} from "@gs/models/projects.server"
import { authenticateRoute } from "@gs/service/auth.server"
import invariant from "@gs/utils/invariant"

const adminApp = adminRegistry.getApp(AdminAppId.Editor)

interface LoaderData {
  item?: ProjectProps
  model: Model
  modelName: ModelName
}

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request)

  const modelName = getProjectsModelName()
  const model = getModelByModelName(modelName)

  const id = params.id
  invariant(id, modelName + " id is required.")

  if (id === "new") return json<LoaderData>({ model, modelName })

  try {
    const item = await getProject(id)
    invariant(item, "Projects item not found.")

    const assocKeys = (
      await Promise.all([getEducationKeys(), getCareerKeys()])
    ).flat()

    // Add options to association property
    model.properties["association"] = {
      type: "string",
      optional: true,
      enum: ["", ...assocKeys],
    }

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
    getProjectsModelName(),
    formData,
    request.method,
  )

  return redirect(redirectTo || pathname)
}

export default function ProjectsEditor(): JSX.Element | null {
  const { item, model, modelName } = useLoaderData<LoaderData>()

  return (
    <EditorPage
      item={item}
      model={model}
      basePreviewPath={modelName}
      headerPrefix={"Projects"}
    />
  )
}
