import type {
  Model,
  ModelArrayType,
  ModelProperties,
  ModelScalerType,
} from "./model.types"
import type { Schema } from "./schema-type"

export function getDataFromModelObject(
  keys: string[],
  formData: FormData,
  properties: ModelProperties<any>,
  modelKeys: string[] = keys,
) {
  const data: Record<string, any> = {}

  keys.forEach((key, i) => {
    const modelKey =
      key === modelKeys[i] ? key : key.split(".").slice(-1).join("")

    const modelProperty = properties[modelKey]
    if (!modelProperty) return

    if (modelProperty.type !== "array") {
      const formValue = formData.get(key)?.toString()
      if (!formValue && modelProperty.type !== "boolean") return

      data[modelKey] = getScalerValue(modelProperty, formValue || "")
      return
    }

    // array
    if (modelProperty.type === "array" && modelProperty.items) {
      const value = getDataFromModelArray(
        modelKey,
        formData,
        modelProperty.items,
      )
      if (value) data[modelKey] = value
      return
    }
  })

  return data
}

export function getDataFromModelArray(
  modelKey: string,
  formData: FormData,
  items: ModelArrayType<any>,
) {
  if (items.type !== "object") {
    const formValue = formData.get(modelKey)?.toString()
    if (!formValue) return

    return formValue
      .split(",")
      .map((val) => val.trim())
      .filter(Boolean)
      .map((val) => getScalerValue(items, val))
  }

  const formKeysArray = [...formData.keys()]
    .filter((k) => k.startsWith(modelKey))
    .reduce((acc, k) => {
      const [modelKey, indexStr] = k.split(".")
      const index = Number.parseInt(indexStr, 10)
      acc[index] =
        acc[index] ||
        Object.keys(items.properties).map((x) => `${modelKey}.${index}.${x}`)

      return acc
    }, [])

  const values = formKeysArray.map((formKeys) =>
    getDataFromModelObject(formKeys, formData, items.properties, []),
  )

  return values
}

function getScalerValue({ type }: ModelScalerType, value: string) {
  return type === "boolean"
    ? Boolean(value === "on" || value === "true")
    : type === "number"
    ? parseFloat(value)
    : value
}

export function transformSchemaInModel(schema: Schema): Model {
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
