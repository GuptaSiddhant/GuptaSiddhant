import type { ModelArrayType, ModelProperties } from "@gs/models"
import { useState } from "react"

import Button from "~/features/ui/Button"
import { capitalize } from "~/features/utils/format"

import EditorFormObjectInput from "./EditorFormObjectInput"
import EditorFormTextInput from "./EditorFormTextInput"

export default function EditorFormArrayInput({
  name,
  list,
  item,
}: {
  name: string
  list?: ModelArrayType<any>
  item?: any
  required?: boolean
}): JSX.Element | null {
  if (!list) return null

  if (list.type === "object") {
    return (
      <EditorFormObjectList
        name={name}
        items={item?.[name]}
        properties={list.properties}
      />
    )
  }

  return (
    <EditorFormTextInput
      name={name}
      defaultValue={item?.[name]}
      required={list.optional === false}
      placeholder={`Comma separated values (${list.type})`}
    />
  )
}

export function EditorFormObjectList({
  name,
  items = [],
  properties,
}: {
  name: string
  items: any[]
  properties: ModelProperties<any>
}): JSX.Element | null {
  const [count, setCount] = useState(items.length)

  return (
    <fieldset className="flex flex-col gap-2 rounded border border-divider p-2">
      <legend className="text-base">{capitalize(name)}</legend>

      {Array(count)
        .fill(0)
        .map((_, index: number) => (
          <div
            key={index}
            className="flex w-full flex-wrap gap-4 border-b border-divider pb-2"
          >
            <div className="text-sm text-disabled">
              {(index + 1).toString().padStart(2, "0")}
            </div>
            <EditorFormObjectInput
              item={items[index] || {}}
              properties={properties}
              namePrefix={`${name}.${index}.`}
              className="!gap-2"
            />
          </div>
        ))}
      <Button.Secondary
        className="w-max text-sm"
        type="button"
        onClick={() => setCount((c) => c + 1)}
      >
        + Add item
      </Button.Secondary>
    </fieldset>
  )
}
