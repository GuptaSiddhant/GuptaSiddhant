import clsx from "clsx"
import { type ComponentPropsWithoutRef } from "react"

import { type BaseProps } from "~/packages//types"
import { capitalize } from "~/packages/helpers/format"

export default {
  List: TagList,
  Tag: Tag,
  Button: TagButton,
  Checkbox: TagCheckbox,
}

function TagList({
  tags,
  className,
  TagComponent = ({ tag }) => <Tag>{tag}</Tag>,
  prefixElement,
  suffixElement,
  limitBy,
}: {
  tags: string[]
  className?: string
  tagElement?: JSX.Element
  TagComponent?: (props: { tag: string }) => JSX.Element
  prefixElement?: JSX.Element
  suffixElement?: JSX.Element
  limitBy?: number
}): JSX.Element {
  const limit = limitBy ?? tags.length
  return (
    <fieldset
      className={clsx(
        "relative my-2 flex flex-wrap items-center gap-2",
        className,
      )}
    >
      {prefixElement}
      {tags.slice(0, limit).map((tag) => (
        <TagComponent key={tag.toString()} tag={capitalize(tag)} />
      ))}
      {suffixElement}
    </fieldset>
  )
}

const tagCommonStyle = clsx("text-base")

function Tag({ className, ...props }: BaseProps) {
  return (
    <div
      {...props}
      className={clsx(
        tagCommonStyle,
        "rounded",
        "border-2 border-gray-700 py-0 px-1",
        className,
      )}
    />
  )
}

function TagButton({
  className,
  ...props
}: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      {...props}
      className={clsx(
        tagCommonStyle,
        "rounded px-2 py-1",
        "bg-quaternary hocus:bg-disabled active:bg-tertiary",
        className,
      )}
    />
  )
}

function TagCheckbox({
  id,
  className,
  value,
  label,
  ...props
}: ComponentPropsWithoutRef<"input"> & { label?: string }) {
  const htmlId = id || `tag-${value}`
  return (
    <>
      <input
        id={htmlId}
        {...props}
        type={"checkbox"}
        className={"peer absolute scale-0"}
        value={value}
      />
      <label
        htmlFor={htmlId}
        className={clsx(
          tagCommonStyle,
          "rounded-sm px-2 py-1 cursor-pointer",
          "bg-secondary peer-checked:bg-quaternary",
          "hocus:bg-tertiary peer-checked:hocus:bg-disabled",
          "peer-hocus:ring-4",
          "flex items-center gap-2",
          "after:content-none peer-checked:after:content-['×'] after:text-sm after:text-danger",
          "peer-disabled:text-disabled peer-disabled:cursor-not-allowed peer-disabled:bg-secondary",
          className,
        )}
      >
        {label || value}
      </label>
    </>
  )
}
