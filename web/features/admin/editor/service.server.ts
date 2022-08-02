import invariant from "tiny-invariant"

import { getModelByModelName } from "@gs/models"
import { getDataFromModelObject } from "@gs/models/model.helpers"
import Database, {
  type DatabaseDocument,
  type ModelName,
} from "@gs/service/database.server"

export async function modifyDatabaseDocumentWithEditorForm<
  T extends DatabaseDocument,
>(
  ModelName: ModelName,
  formData: FormData,
  method: string,
): Promise<string | undefined> {
  const id = formData.get("id")?.toString()
  invariant(id, ModelName + " id is required.")
  const database = new Database(ModelName)

  if (method === "DELETE") {
    const deleted = await database.mutateById(id)

    if (deleted) return generateRedirectUrl(ModelName)
    return generateRedirectUrl(ModelName, id)
  }

  const model = getModelByModelName(ModelName)
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

  return generateRedirectUrl(ModelName, id)
}

// Helper

function generateRedirectUrl(...paths: string[]) {
  return ["/admin/editor", ...paths].join("/")
}
