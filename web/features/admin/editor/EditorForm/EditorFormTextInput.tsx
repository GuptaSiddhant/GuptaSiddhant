import clsx from "clsx"
import { useId } from "react"

import FormLabel from "@gs/ui/FormLabel"
import Input from "@gs/ui/Input"
import Select from "@gs/ui/Select"
import { formatYYYYMMDD, toTitleCase } from "@gs/utils/format"

import { requiredLabelClassName } from "./helpers"
import type { EditorFormInputProps } from "./types"

export default function EditorFormTextInput(
  props: EditorFormInputProps<string>,
): JSX.Element | null {
  const {
    name,
    defaultValue,
    readOnly,
    required,
    placeholder,
    options,
    className,
  } = props

  const labelElement = (
    <span className={clsx("text-sm", requiredLabelClassName(required))}>
      {toTitleCase(name.split(".").at(-1) || name)}
    </span>
  )
  const id = name + useId()

  if (options && options.length > 0) {
    return (
      <Select
        id={id}
        label={labelElement}
        name={name}
        disabled={readOnly}
        defaultValue={defaultValue}
        vertical
        required={required}
      >
        {options.map((option) => (
          <Select.Option key={option} value={option}>
            {option}
          </Select.Option>
        ))}
      </Select>
    )
  }

  const isDate = name.toLowerCase().includes("date")

  if (isDate) {
    return (
      <Input
        id={id}
        label={labelElement}
        labelClassName={clsx("flex flex-col")}
        type="date"
        pattern="^\\d{4}-\\d{2}-\\d{2}$"
        placeholder="YYYY-MM-DD"
        name={name}
        required={required}
        defaultValue={
          defaultValue ? formatYYYYMMDD(new Date(defaultValue)) : undefined
        }
      />
    )
  }

  const isDescription = name.toLowerCase().includes("description")

  if (isDescription) {
    return (
      <FormLabel
        htmlFor={id}
        label={labelElement}
        className={clsx(className, "row-span-2")}
        vertical
      >
        <textarea
          id={id}
          className="h-full w-full resize-none bg-transparent p-2"
          name={name}
          defaultValue={defaultValue}
          readOnly={readOnly}
          required={required}
          placeholder="Enter description here"
        />
      </FormLabel>
    )
  }

  const isUrl = name.toLowerCase().includes("url")
  const isEmail = name.toLowerCase().includes("email")
  const placeholderText =
    placeholder || (isUrl ? "https://" : isEmail ? "abc@xyx" : "")

  return (
    <Input
      id={id}
      label={labelElement}
      labelClassName={clsx(
        className,
        "flex flex-col",
        isDescription && "row-span-2",
      )}
      className={"w-full"}
      name={name}
      defaultValue={defaultValue}
      readOnly={readOnly}
      required={required}
      placeholder={placeholderText}
      type={isEmail ? "email" : "text"}
    />
  )
}
