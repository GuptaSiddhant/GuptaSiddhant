import clsx from "clsx"

import type { ModelProperties } from "@gs/models/helpers/model.types"
import { toTitleCase } from "@gs/utils/format"

import { useEditorFormContext } from "."
import EditorFormArrayInput from "./EditorFormArrayInput"
import EditorFormBooleanInput from "./EditorFormBooleanInput"
import EditorFormCodeInput from "./EditorFormCodeInput"
import EditorFormMarkdownInput from "./EditorFormMarkdownInput"
import EditorFormTextInput from "./EditorFormTextInput"
import {
  fieldsetClassName,
  objectGridClassName,
  requiredLabelClassName,
  sortRequiredPredicate,
} from "./helpers"

export default function EditorFormObjectInput<T extends Record<string, any>>({
  properties,
  item,
  namePrefix = "",
}: {
  properties: ModelProperties<any>
  item?: T
  namePrefix?: string
  className?: string
}) {
  const { newItem } = useEditorFormContext()

  const formEntries = Object.entries(properties)
    .filter(([prop]) => prop !== "id")
    .sort(([a], [b]) => b.localeCompare(a))

  const formTextEntries = formEntries
    .filter(
      ([_, modelProp]) =>
        (modelProp.type === "string" && !modelProp.contentMediaType) ||
        modelProp.type === "number",
    )
    .sort(sortRequiredPredicate)

  const formMarkdownEntries = formEntries
    .filter(
      ([_, modelProp]) =>
        modelProp.type === "string" &&
        modelProp.contentMediaType === "markdown",
    )
    .sort(sortRequiredPredicate)

  const formCodeEntries = formEntries
    .filter(
      ([_, modelProp]) =>
        modelProp.type === "string" && modelProp.contentMediaType === "code",
    )
    .sort(sortRequiredPredicate)

  const formBooleanEntries = formEntries
    .filter(([_, modelProp]) => modelProp.type === "boolean")
    .sort(sortRequiredPredicate)

  const formArrayEntries = formEntries
    .filter(([_, modelProp]) => modelProp.type === "array")
    .sort(sortRequiredPredicate)

  const formObjectEntries = formEntries
    .filter(([_, modelProp]) => modelProp.type === "object")
    .sort(sortRequiredPredicate)

  return (
    <>
      {formTextEntries.length > 0 &&
        formTextEntries.map(([key, modelProp]) => (
          <EditorFormTextInput
            key={key}
            name={namePrefix + key}
            defaultValue={item?.[key as keyof T] as any}
            required={modelProp.required}
            options={"enum" in modelProp ? modelProp.enum : []}
            className="col-span-2"
          />
        ))}
      {formBooleanEntries.length > 0 &&
        formBooleanEntries.map(([key, modelProp]) =>
          modelProp.type === "boolean" ? (
            <EditorFormBooleanInput
              key={key}
              name={namePrefix + key}
              defaultValue={
                newItem ? modelProp.default : (item?.[key as keyof T] as any)
              }
              required={modelProp.required}
            />
          ) : null,
        )}

      {formArrayEntries.map(([key, modelProp]) => (
        <EditorFormArrayInput
          key={key}
          name={namePrefix + key}
          required={modelProp.required}
          item={item}
          list={modelProp.type === "array" ? modelProp.items : undefined}
        />
      ))}

      {formMarkdownEntries.map(([key, modelProp]) => (
        <EditorFormMarkdownInput
          key={key}
          name={namePrefix + key}
          defaultValue={item?.[key as keyof T] as any}
          required={modelProp.required}
        />
      ))}

      {formCodeEntries.map(([key, modelProp]) => (
        <EditorFormCodeInput
          key={key}
          name={namePrefix + key}
          defaultValue={item?.[key as keyof T] as any}
          required={modelProp.required}
        />
      ))}

      {formObjectEntries.map(([key, modelProp]) =>
        modelProp.type === "object" ? (
          <fieldset
            aria-required={modelProp.required}
            className={clsx(objectGridClassName, fieldsetClassName)}
          >
            <legend
              className={clsx(
                "px-1 text-base",
                requiredLabelClassName(modelProp.required),
              )}
            >
              {toTitleCase(key)}
            </legend>
            <EditorFormObjectInput
              key={key}
              {...modelProp}
              item={item?.[key]}
            />
          </fieldset>
        ) : null,
      )}
    </>
  )
}
