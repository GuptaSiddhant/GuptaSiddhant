import type { Model, ModelScalerType, ModelsMap } from "./types"

export function getDataFromModelObject(
  keys: string[],
  formData: FormData,
  properties: ModelsMap,
  modelKeys: string[] = keys,
) {
  const data: Record<string, any> = {}

  keys.forEach((key, i) => {
    const modelKey =
      key === modelKeys[i] ? key : key.split(".").slice(-1).join("")
    console.log({ key, modelKey })

    const modelProperty = properties[modelKey]
    if (!modelProperty) return

    // array
    if (modelProperty.type === "array") {
      const value = getDataFromModelArray(
        modelKey,
        formData,
        modelProperty.items,
      )
      if (value) data[modelKey] = value
      return
    }

    if (modelProperty.type === "object") {
      const value = getDataFromModelObject(
        Object.keys(modelProperty.properties).map((k) =>
          [key, k].filter(Boolean).join("."),
        ),
        formData,
        modelProperty.properties,
        Object.keys(modelProperty.properties),
      )
      if (value) data[modelKey] = value
      return
    }

    // scaler

    const formValue = formData.get(key)?.toString()
    if (!formValue && modelProperty.type !== "boolean") return

    data[modelKey] = getScalerValue(modelProperty, formValue || "")
  })

  return data
}

export function getDataFromModelArray(
  modelKey: string,
  formData: FormData,
  items: Model,
) {
  console.log({ items, modelKey })

  if (items.type === "object") {
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

  if (items.type !== "array") {
    const formValue = formData.get(modelKey)?.toString()
    if (!formValue) return

    return formValue
      .split(",")
      .map((val) => val.trim())
      .filter(Boolean)
      .map((val) => getScalerValue(items, val))
  }

  // TODO: handle array of arrays
}

function getScalerValue({ type }: ModelScalerType, value: string) {
  return type === "boolean"
    ? Boolean(value === "on" || value === "true")
    : type === "number"
    ? parseFloat(value)
    : value
}
