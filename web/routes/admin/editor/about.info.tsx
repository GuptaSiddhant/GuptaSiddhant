import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"

import { AdminAppId, adminRegistry } from "@gs/admin"
import EditorPage from "@gs/admin/editor/EditorPage"
import { adminLogger } from "@gs/admin/service.server"
import {
  type Model,
  getDataFromModelObject,
  getModelByModelName,
  ModelName,
} from "@gs/models"
import type { AboutInfo } from "@gs/models/about/index.server"
import {
  aboutInfoKey,
  getAboutDatabase,
  getAboutInfo,
  getAboutModelName,
} from "@gs/models/about/index.server"
import { getCareerKeys } from "@gs/models/career/index.server"
import { authenticateRoute } from "@gs/service/auth.server"
import { type DatabaseDocument } from "@gs/service/database.server"

const adminApp = adminRegistry.getApp(AdminAppId.Editor)

interface LoaderData {
  info?: AboutInfo
  model: Model
  modelName: ModelName
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticateRoute(request)
  const modelName = getAboutModelName()
  const model = getModelByModelName(modelName)

  try {
    const info = await getAboutInfo()
    const enrichedModel = await enrichModel(modelName, model)

    return json<LoaderData>({ info, model: enrichedModel, modelName })
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
  const modelName = getAboutModelName()
  const model = getModelByModelName(modelName)
  const data = getDataFromModelObject(
    Object.keys(model.properties),
    formData,
    model.properties,
  ) as DatabaseDocument

  switch (request.method) {
    case "PATCH": {
      database.invalidateCacheById(aboutInfoKey)
      break
    }

    case "POST":
    case "PUT": {
      console.log(data)
      database.mutateById(aboutInfoKey, data)
      break
    }
  }

  return redirect(pathname)
}

export default function Editor(): JSX.Element | null {
  const { info, model } = useLoaderData<LoaderData>()

  return <EditorPage item={info} model={model} headerPrefix={"About"} />
}

// Helpers

async function enrichModel(modelName: ModelName, model: Model): Promise<Model> {
  if (modelName === ModelName.About) {
    const keys = await getCareerKeys()

    if (model.type === "object") {
      // Add options to association property
      model.properties["currentCompany"] = {
        ...(model.properties["currentCompany"] || {}),
        type: "string",
        enum: ["", ...keys],
      }
    }
  }

  return model
}
