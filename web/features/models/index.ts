import { DatabaseModel } from "../service/database.server"
import type { Schema } from "./schema-type"
import {
  blogSchema,
  careerSchema,
  educationSchema,
  projectSchema,
} from "./schemas"

export function getModelByDatabaseModel(modelName: DatabaseModel) {
  switch (modelName) {
    case DatabaseModel.Career:
      return transformSchemaInModel(careerSchema)
    case DatabaseModel.Education:
      return transformSchemaInModel(educationSchema)
    case DatabaseModel.Blog:
      return transformSchemaInModel(blogSchema)
    case DatabaseModel.Projects:
      return transformSchemaInModel(projectSchema)
    default:
      throw new Error(`Unknown model name: ${modelName}`)
  }
}

function transformSchemaInModel(schema: Schema): Model {
  const model = {
    type: "object",
    properties: schema.properties || {},
  }

  const required = schema.required || []
  Object.keys(model.properties).forEach((key) => {
    const optional = required.indexOf(key) === -1
    ;(model.properties[key] as any).optional = optional
    ;(model.properties[key] as any).required = !optional
  })

  return model as Model
}

export type Model<T extends string = string> = ModelObjectType<T>

export type ModelProperty<T extends any> =
  | ModelScalerType
  | {
      type: "array"
      items: ModelArrayType<T>
      optional?: boolean
    }

export type ModelObjectType<T extends any> = {
  type: "object"
  properties: ModelProperties<T>
  required?: T[]
  optional?: boolean
}

export type ModelProperties<T extends any> = Record<string, ModelProperty<T>>

export type ModelScalerType =
  | {
      type: "boolean"
      optional?: boolean
      default?: boolean
    }
  | {
      type: "number"
      optional?: boolean
    }
  | {
      type: "string"
      optional?: boolean
      enum?: string[]
      contentMediaType?: "markdown"
    }

export type ModelArrayType<T extends any> = ModelScalerType | ModelObjectType<T>
