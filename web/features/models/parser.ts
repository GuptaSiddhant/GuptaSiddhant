import type { ModelArrayType, ModelObjectType, ModelScalerType } from "./types"

export function parseFormDataWithModelObject<T extends Record<string, any>>(
  formData: FormData,
  model: ModelObjectType,
  prefix = "",
): T {
  const data: Record<string, any> = {}
  const { properties } = model

  Object.keys(properties).forEach((key) => {
    const propertyModel = properties[key]
    const prefixedKey = [prefix, key].filter(Boolean).join(".")

    if (propertyModel.type === "object") {
      return (data[key] = parseFormDataWithModelObject(
        formData,
        propertyModel,
        prefixedKey,
      ))
    }

    if (propertyModel.type === "array") {
      return (data[key] = parseFormDataWithModelArray(
        formData,
        propertyModel,
        prefixedKey,
      ))
    }

    // Scaler
    data[key] = parseFormValueWithModelScaler(
      formData.get(prefixedKey),
      propertyModel,
    )
  })

  return data as T
}

function parseFormDataWithModelArray(
  formData: FormData,
  model: ModelArrayType,
  key: string,
): any[] {
  const itemModel = model.items

  if (itemModel.type === "object") {
    const keyIndices = [...formData.keys()]
      .filter((k) => k.startsWith(key))
      .map((k) => k.slice(key.length).split(".")[1])

    const countArray = Array([...new Set(keyIndices)].length).fill(0)

    return countArray.map((_, index) =>
      parseFormDataWithModelObject(formData, itemModel, `${key}.${index}`),
    )
  }

  // Scaler
  const formValues =
    formData
      .getAll(key)
      .join(",")
      .split(",")
      .filter(Boolean)
      .map((s) => s.trim()) || []

  return formValues.map((value) =>
    parseFormValueWithModelScaler(value, itemModel),
  )
}

function parseFormValueWithModelScaler(
  value: FormDataEntryValue | null,
  model: ModelScalerType,
) {
  if (value instanceof File)
    throw new Error("'File' cannot be parsed as FormValue.")

  if (model.type === "number") {
    if (value === null) return 0
    return parseFloat(value)
  }

  if (model.type === "boolean") {
    if (value === null) return Boolean(model.default)
    return Boolean(value === "on" || value === "true")
  }

  return value === null ? "" : value
}
