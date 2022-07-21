import clsx from "clsx"

import Input from "@gs/ui/Input"
import Select from "@gs/ui/Select"
import { capitalize, formatYYYYMMDD } from "@gs/utils/format"

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
  const labelText = capitalize(name.split(".").at(-1) || name)
  const labelElement = (
    <span
      className={clsx(
        "text-sm",
        required && "after:text-negative after:content-['*']",
      )}
    >
      {labelText}
    </span>
  )

  if (options && options.length > 0) {
    return (
      <Select
        label={labelElement}
        name={name}
        disabled={readOnly}
        defaultValue={defaultValue}
        vertical
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
        label={labelElement}
        labelClassName={clsx("flex flex-col")}
        type="date"
        pattern="^\\d{4}-\\d{2}-\\d{2}$"
        placeholder="YYYY-MM-DD"
        name={name}
        defaultValue={
          defaultValue ? formatYYYYMMDD(new Date(defaultValue)) : undefined
        }
      />
    )
  }

  const isUrl = name.toLowerCase().includes("url")
  const isEmail = name.toLowerCase().includes("email")
  const placeholderText =
    placeholder || (isUrl ? "https://" : isEmail ? "abc@xyx" : "")

  return (
    <Input
      label={labelElement}
      labelClassName={clsx(className, "flex flex-col")}
      className="w-full"
      name={name}
      defaultValue={defaultValue}
      readOnly={readOnly}
      required={required}
      placeholder={placeholderText}
      type={isEmail ? "email" : "text"}
    />
  )
}
