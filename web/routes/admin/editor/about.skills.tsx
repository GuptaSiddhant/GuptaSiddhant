import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"

import { AdminAppId, adminRegistry } from "@gs/admin"
import EditorPage from "@gs/admin/editor/EditorPage"
import { adminLogger } from "@gs/admin/service.server"
import {
  type Model,
  type ModelName,
  getDataFromModelObject,
  getModelByModelName,
} from "@gs/models"
import type { Skills } from "@gs/models/about/index.server"
import {
  aboutSkillsKey,
  getAboutDatabase,
  getAboutSkills,
  getAboutSkillsModelName,
} from "@gs/models/about/index.server"
import { authenticateRoute } from "@gs/service/auth.server"
import { type DatabaseDocument } from "@gs/service/database.server"

const adminApp = adminRegistry.getApp(AdminAppId.Editor)

interface LoaderData {
  skills?: Skills
  model: Model
  modelName: ModelName
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)
  const modelName = getAboutSkillsModelName()
  const model = getModelByModelName(modelName)

  try {
    const skills = await getAboutSkills()

    return json<LoaderData>({ skills, model, modelName })
  } catch (e: any) {
    adminLogger.error(e.message)

    return redirect(adminApp.linkPath + modelName)
  }
}

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request)
  const { pathname } = new URL(request.url)
  const formData = await request.formData()

  const database = getAboutDatabase()
  const modelName = getAboutSkillsModelName()
  const model = getModelByModelName(modelName)
  const data = getDataFromModelObject(
    Object.keys(model.properties),
    formData,
    model.properties,
  ) as DatabaseDocument

  switch (request.method) {
    case "PATCH": {
      database.invalidateCacheById(aboutSkillsKey)
      break
    }

    case "POST":
    case "PUT": {
      database.mutateById(aboutSkillsKey, data)
      break
    }
  }

  return redirect(pathname)
}

export default function BlogEditor(): JSX.Element | null {
  const { skills, model } = useLoaderData<LoaderData>()

  return <EditorPage item={skills} model={model} headerPrefix={"About"} />
}
