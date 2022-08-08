import { type ModelName, getModelByModelName } from "@gs/models"
import { getDataFromModelObject } from "@gs/models/helpers/model.helpers"
import Database, { type DatabaseDocument } from "@gs/service/database.server"
import invariant from "@gs/utils/invariant"

export async function modifyDatabaseDocumentWithEditorForm<
  T extends DatabaseDocument,
>(
  modelName: ModelName,
  formData: FormData,
  method: string,
): Promise<string | undefined> {
  const id = formData.get("id")?.toString()
  invariant(id, modelName + " id is required.")
  const database = new Database(modelName)

  if (method === "DELETE") {
    const deleted = await database.mutateById(id)

    if (deleted) return generateRedirectUrl(modelName)
    return generateRedirectUrl(modelName, id)
  }

  const model = getModelByModelName(modelName)
  const data = getDataFromModelObject(
    Object.keys(model.properties),
    formData,
    model.properties,
  ) as T

  switch (method) {
    case "PATCH": {
      database.invalidateCacheById(id)
      break
    }

    case "POST":
    case "PUT": {
      database.mutateById(id, data)
      break
    }
  }

  return generateRedirectUrl(modelName, id)
}

// Helper

function generateRedirectUrl(...paths: string[]) {
  return ["/admin/editor", ...paths].join("/")
}
