import clsx from "clsx"

import type { ModelsMap } from "@gs/models/helpers/model.types"
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
  properties: ModelsMap
  item?: T
  namePrefix?: string
  className?: string
}) {
  const { newItem } = useEditorFormContext()

  const formEntries = Object.entries(properties).filter(
    ([prop]) => prop !== "id",
  )

  const formTextEntries = formEntries
    .filter(
      ([_, modelProp]) =>
        (modelProp.type === "string" && !modelProp.format) ||
        modelProp.type === "number",
    )
    .sort(sortRequiredPredicate)

  const formMarkdownEntries = formEntries
    .filter(
      ([_, modelProp]) =>
        modelProp.type === "string" && modelProp.format === "markdown",
    )
    .sort(sortRequiredPredicate)

  const formCodeEntries = formEntries
    .filter(
      ([_, modelProp]) =>
        modelProp.type === "string" && modelProp.format === "code",
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

  const colClassName = (size?: string) =>
    clsx(
      size === "large"
        ? "col-span-full"
        : size === "medium"
        ? "col-span-2"
        : "",
    )

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
            className={colClassName(modelProp.size)}
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
              className={colClassName(modelProp.size)}
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
