import type { ModelProperties, ModelProperty } from "@gs/models"
import clsx from "clsx"

import EditorFormArrayInput from "./EditorFormArrayInput"
import EditorFormBooleanInput from "./EditorFormBooleanInput"
import EditorFormMarkdownInput from "./EditorFormMarkdownInput"
import EditorFormTextInput from "./EditorFormTextInput"

export default function EditorFormObjectInput<T extends Record<string, any>>({
  properties,
  item,
  namePrefix = "",
  className,
}: {
  properties: ModelProperties<any>
  item?: T
  namePrefix?: string
  className?: string
}) {
  const formEntries = Object.entries(properties)
    .filter(([prop]) => prop !== "id")
    .sort(([a], [b]) => b.localeCompare(a))

  const sortRequired = (
    a: [string, ModelProperty<string>],
    b: [string, ModelProperty<string>],
  ) => (a[1].optional ? 1 : b[1].optional ? -1 : 0)

  const formTextEntries = formEntries
    .filter(
      ([_, modelProp]) =>
        (modelProp.type === "string" && !modelProp.contentMediaType) ||
        modelProp.type === "number",
    )
    .sort(sortRequired)

  const formMarkdownEntries = formEntries
    .filter(
      ([_, modelProp]) =>
        modelProp.type === "string" &&
        modelProp.contentMediaType === "markdown",
    )
    .sort(sortRequired)

  const formBooleanEntries = formEntries
    .filter(([_, modelProp]) => modelProp.type === "boolean")
    .sort(sortRequired)

  const formArrayEntries = formEntries
    .filter(([_, modelProp]) => modelProp.type === "array")
    .sort(sortRequired)

  return (
    <>
      {formTextEntries.length > 0 &&
        formTextEntries.map(([key, modelProp]) => (
          <EditorFormTextInput
            key={key}
            name={namePrefix + key}
            defaultValue={item?.[key as keyof T] as any}
            required={modelProp.optional === false}
            options={"enum" in modelProp ? modelProp.enum : []}
            className="col-span-2"
          />
        ))}
      {formBooleanEntries.length > 0 &&
        formBooleanEntries.map(([key, modelProp]) => (
          <EditorFormBooleanInput
            key={key}
            name={namePrefix + key}
            defaultValue={item?.[key as keyof T] as any}
            required={modelProp.optional === false}
          />
        ))}

      {formArrayEntries.map(([key, modelProp]) => (
        <EditorFormArrayInput
          key={key}
          name={namePrefix + key}
          required={modelProp.optional === false}
          item={item}
          list={modelProp.type === "array" ? modelProp.items : undefined}
        />
      ))}

      {formMarkdownEntries.map(([key, modelProp]) => (
        <EditorFormMarkdownInput
          key={key}
          name={namePrefix + key}
          defaultValue={item?.[key as keyof T] as any}
          required={modelProp.optional === false}
        />
      ))}
    </>
  )
}
