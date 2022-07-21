import invariant from "tiny-invariant"

import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { json, redirect } from "@remix-run/server-runtime"

import { AdminAppId, adminRegistry } from "@gs/admin"
import EditorPage from "@gs/admin/editor/EditorPage"
import { modifyDatabaseDocumentWithEditorForm } from "@gs/admin/editor/service.server"
import { adminLogger } from "@gs/admin/service.server"
import type { BlogPostProps } from "@gs/blog"
import { databaseBlog } from "@gs/blog/service.server"
import { type Model, getModelByDatabaseModel } from "@gs/models"
import { authenticateRoute } from "@gs/service/auth.server"
import { DatabaseModel } from "@gs/service/database.server"

const adminApp = adminRegistry.getApp(AdminAppId.Editor)

interface LoaderData {
  item?: BlogPostProps
  model: Model
}

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticateRoute(request)
  const modelName = DatabaseModel.Blog
  const model = getModelByDatabaseModel(modelName)

  const id = params.id
  invariant(id, modelName + " id is required.")

  if (id === "new") return json<LoaderData>({ model })

  try {
    const item = await databaseBlog.queryById(id)
    invariant(item, "Blog item not found.")

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
    databaseBlog,
    formData,
    request.method,
  )

  return redirect(redirectTo || pathname)
}

export default function BlogEditor(): JSX.Element | null {
  const { item, model } = useLoaderData<LoaderData>()

  return (
    <EditorPage
      item={item}
      model={model}
      headerPrefix={"Blog"}
      basePreviewPath="blog"
    />
  )
}
