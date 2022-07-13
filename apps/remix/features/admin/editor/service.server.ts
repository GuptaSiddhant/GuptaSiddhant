import invariant from "tiny-invariant"

import { getModelByDatabaseModel } from "@features/experiences/helpers"
import { getDataFromModelObject } from "@features/models/helpers"
import {
  type DatabaseDocument,
  type DatabaseModel,
  type DatabaseType,
} from "@features/service/database.server"

export async function modifyDatabaseDocumentWithEditorForm<
  T extends DatabaseDocument,
>(
  database: DatabaseType<T>,
  formData: FormData,
  method: string,
): Promise<string | undefined> {
  const id = formData.get("id")?.toString()
  invariant(id, database.model + " id is required.")

  if (method === "DELETE") {
    const deleted = await database.mutateById(id)

    if (deleted) return generateRedirectUrl(database.model)
    return generateRedirectUrl(database.model, id)
  }

  const model = getModelByDatabaseModel(database.model as DatabaseModel)
  const data = getDataFromModelObject(
    Object.keys(model.properties),
    formData,
    model.properties,
  ) as T

  switch (method) {
    case "PATCH": {
      database.invalidateCacheById(id)
    }

    case "POST":
    case "PUT": {
      database.mutateById(id, data)
    }
  }

  return generateRedirectUrl(database.model, id)
}

// Helper

function generateRedirectUrl(...paths: string[]) {
  return ["/admin/editor", ...paths].join("/")
}
