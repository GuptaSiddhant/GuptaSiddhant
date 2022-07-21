import clsx from "clsx"
import { useState } from "react"

import { DeleteIcon } from "@gs/icons"
import type { ModelArrayType, ModelProperties } from "@gs/models"
import Button from "@gs/ui/Button"
import { capitalize } from "@gs/utils/format"

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
  properties: ModelProperties<any>
}): JSX.Element | null {
  const [list, setList] = useState(items)

  const handleAdd = () => setList((l) => [...l, {}])

  const handleRemove = (index: number) =>
    setList(list.filter((_, i) => i !== index))

  return (
    <fieldset className="col-span-full flex flex-col gap-2 rounded border border-divider p-2">
      <legend className="text-base">{capitalize(name)}</legend>

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
          <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6">
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
