import { type FormMethod, Form } from "@remix-run/react"
import clsx from "clsx"
import { useState } from "react"

import { capitalize, formatYYYYMMDD } from "~/features/helpers/format"
import type {
  ModelArrayType,
  ModelProperties,
  ModelProperty,
} from "~/features/models"
import { type Model } from "~/features/models"
import Accordion from "~/features/ui/Accordion"
import Button from "~/features/ui/Button"
import FormLabel from "~/features/ui/FormLabel"
import Input from "~/features/ui/Input"
import Select from "~/features/ui/Select"

export interface EditorFormProps<T extends Record<string, any>> {
  method: FormMethod
  formId: string
  item?: T
  model: Model
}

export default function EditorForm<T extends { id: string }>({
  method,
  item,
  model,
  formId,
}: EditorFormProps<T>): JSX.Element | null {
  return (
    <Form id={formId} method={method} replace className="flex flex-col gap-4">
      {item?.id ? (
        <input type="hidden" name="id" value={item.id} />
      ) : (
        <EditorFormTextInput name="id" defaultValue={""} required />
      )}
      <EditorFormObjectInput item={item} properties={model.properties} />
    </Form>
  )
}

function EditorFormArrayInput({
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

function EditorFormObjectList({
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

interface EditorFormInputProps<T = any> {
  name: string
  defaultValue: T
  readOnly?: boolean
  required?: boolean
  placeholder?: string
  options?: T[]
}

function EditorFormObjectInput<T extends Record<string, any>>({
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
      {formTextEntries.length > 0 && (
        <fieldset
          className={clsx(
            className,
            "grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {formTextEntries.map(([key, modelProp]) => (
            <EditorFormTextInput
              key={key}
              name={namePrefix + key}
              defaultValue={item?.[key as keyof T] as any}
              required={modelProp.optional === false}
              options={"enum" in modelProp ? modelProp.enum : []}
            />
          ))}
        </fieldset>
      )}
      {formBooleanEntries.length > 0 && (
        <fieldset
          className={clsx(
            className,
            "grid flex-1 grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6",
          )}
        >
          {formBooleanEntries.map(([key, modelProp]) => (
            <EditorFormBooleanInput
              key={key}
              name={namePrefix + key}
              defaultValue={item?.[key as keyof T] as any}
              required={modelProp.optional === false}
            />
          ))}
        </fieldset>
      )}

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

function EditorFormMarkdownInput({
  name,
  defaultValue,
  required,
}: EditorFormInputProps<string>) {
  return (
    <Accordion summary={name} open summaryClassName="!m-0">
      <div className="p-0">
        <textarea
          name={name}
          defaultValue={defaultValue}
          required={required}
          className="min-h-[50vh] w-full rounded bg-default p-2 text-base"
        />
      </div>
    </Accordion>
  )
}

function EditorFormTextInput(
  props: EditorFormInputProps<string>,
): JSX.Element | null {
  const { name, defaultValue, readOnly, required, placeholder, options } = props
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
      labelClassName={clsx("flex flex-col")}
      className="w-full"
      name={name}
      defaultValue={defaultValue}
      readOnly={readOnly}
      required={required}
      placeholder={placeholderText}
      type={isUrl ? "url" : isEmail ? "email" : "text"}
    />
  )
}

function EditorFormBooleanInput(
  props: EditorFormInputProps<boolean>,
): JSX.Element | null {
  const { name, defaultValue = false, readOnly, required } = props

  const id = `${name}-checkbox`

  return (
    <FormLabel
      htmlFor={id}
      label={capitalize(name)}
      className="!h-full sm:gap-2"
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        defaultChecked={defaultValue}
        required={required}
        readOnly={readOnly}
      />
    </FormLabel>
  )
}
