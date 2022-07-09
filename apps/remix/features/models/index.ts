import schemaFile from "./schema.json"

const schema = JSON.parse(JSON.stringify(schemaFile))

export default function generateModelFromSchema<T extends string>(
  definition: string,
): Model<T> {
  const parsed = schema.definitions[definition]

  if (!parsed) throw new Error("Could not find definition: " + definition)
  if (!parsed.properties) return parsed

  Object.keys(parsed.properties).forEach((key) => {
    const property = parsed.properties[key]

    if (property.type === "array" && "$ref" in property.items) {
      const ref = property.items.$ref.replace(/^#\/definitions\//, "")
      const refParsed = generateModelFromSchema(ref)
      parsed.properties[key].items = refParsed
    }

    if ("$ref" in property) {
      const ref = property.$ref.replace(/^#\/definitions\//, "")
      const refParsed = generateModelFromSchema(ref)
      parsed.properties[key] = refParsed
    }

    const optional = !(parsed.required && parsed.required.includes(key))
    parsed.properties[key].optional = optional
  })

  return parsed
}

export type Model<T extends string = string> = ModelObjectType<T>

export type ModelProperty<T extends string> =
  | ModelScalerType
  | {
      type: "array"
      items: ModelArrayType<T>
      optional?: boolean
    }

export type ModelObjectType<T extends string> = {
  type: "object"
  properties: ModelProperties<T>
  required?: T[]
  optional?: boolean
}

export type ModelProperties<T extends string> = Record<T, ModelProperty<T>>

export type ModelScalerType =
  | {
      type: "boolean" | "number"
      optional?: boolean
    }
  | {
      type: "string"
      optional?: boolean
      enum?: string[]
    }

export type ModelArrayType<T extends string> =
  | ModelScalerType
  | ModelObjectType<T>
