import clsx from "clsx"
import { useState } from "react"

import { DeleteIcon } from "@gs/icons"
import type { Model, ModelsMap } from "@gs/models/helpers/model.types"
import Button from "@gs/ui/Button"
import { toTitleCase } from "@gs/utils/format"

import EditorFormObjectInput from "./EditorFormObjectInput"
import EditorFormTextInput from "./EditorFormTextInput"
import { fieldsetClassName, objectGridClassName } from "./helpers"

export default function EditorFormArrayInput({
  name,
  list,
  item,
}: {
  name: string
  list?: Model
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

  const value = item?.[name] || []
  if (!Array.isArray(value)) return null

  return (
    <EditorFormTextInput
      name={name}
      defaultValue={value.join(", ")}
      required={list.required}
      placeholder={`Comma separated values (${list.type})`}
      className="col-span-full"
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
  properties: ModelsMap
}): JSX.Element | null {
  const [list, setList] = useState(items)

  const handleAdd = () => setList((l) => [...l, {}])

  const handleRemove = (index: number) =>
    setList(list.filter((_, i) => i !== index))

  return (
    <fieldset
      className={clsx("col-span-full flex flex-col gap-2", fieldsetClassName)}
    >
      <legend className="px-1 text-base">{toTitleCase(name)}</legend>

      {list.map((item = {}, index: number) => (
        <div
          key={index}
          className={clsx("flex w-full gap-4 border-b border-divider pb-2")}
        >
          <div className="flex flex-col gap-2 text-sm text-disabled">
            {(index + 1).toString().padStart(2, "0")}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              title="Delete item"
            >
              <DeleteIcon className="scale-90" />
            </button>
          </div>
          <div className={clsx("flex-1", objectGridClassName)}>
            <EditorFormObjectInput
              item={item}
              properties={properties}
              namePrefix={`${name}.${index}.`}
            />
          </div>
        </div>
      ))}
      <Button.Secondary
        className="w-max text-sm"
        type="button"
        onClick={handleAdd}
      >
        + Add item
      </Button.Secondary>
    </fieldset>
  )
}
