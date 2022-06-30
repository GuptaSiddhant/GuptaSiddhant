import clsx from "clsx"
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  type ReactNode,
  type RefObject,
  useRef,
} from "react"
import ArrowDownIcon from "remixicon-react/ArrowDownSFillIcon"
import ClearIcon from "remixicon-react/CloseCircleLineIcon"

export type SelectProps = ComponentPropsWithoutRef<"select"> & {
  selectRef?: ForwardedRef<HTMLSelectElement> | null
  label?: ReactNode
  onClear?: (selectRef: RefObject<HTMLSelectElement>) => void
}
export type OptionProps = ComponentPropsWithoutRef<"option"> & {
  optionRef?: ForwardedRef<HTMLOptionElement> | null
}
export type GroupProps = ComponentPropsWithoutRef<"optgroup"> & {
  groupRef?: ForwardedRef<HTMLOptGroupElement> | null
}

export default function Select({
  children,
  label,
  id,
  title,
  className,
  onClear,
  ...props
}: SelectProps): JSX.Element | null {
  const selectRef = useRef<HTMLSelectElement>(null)
  const selectId =
    id || props.name || title || (typeof label === "string" ? label : "select")

  const clickSelect = (): void => {
    const event = new MouseEvent("mousedown")
    selectRef.current?.dispatchEvent(event)
  }

  return (
    <fieldset
      title={title}
      className={clsx(
        className,
        "relative min-h-input min-w-min rounded px-2",
        "flex items-center gap-1 text-base",
        "bg-secondary hocus-within:bg-tertiary",
        "text-secondary hocus-within:text-tertiary",
      )}
    >
      {label ? (
        <label htmlFor={selectId} onClick={clickSelect}>
          {label}
        </label>
      ) : null}

      <select
        onChange={() => {}}
        aria-label={title}
        {...props}
        id={selectId}
        ref={selectRef}
        className={clsx(
          "appearance-none rounded-none bg-transparent",
          "w-full py-2 pl-2",
          onClear ? "pr-10" : "pr-6",
        )}
      >
        {children}
      </select>

      {onClear && props.value ? (
        <ClearIcon
          className="absolute right-8 cursor-pointer fill-red-400"
          onClick={() => onClear(selectRef)}
          aria-label="Clear filter"
        />
      ) : null}

      <ArrowDownIcon
        role="presentation"
        className="absolute right-2"
        onClick={clickSelect}
      />
    </fieldset>
  )
}

Select.Option = Option
Select.Group = Group

function Group({ groupRef, ...props }: GroupProps): JSX.Element {
  return <optgroup {...props} ref={groupRef} />
}

function Option({ optionRef, ...props }: OptionProps): JSX.Element {
  return <option {...props} ref={optionRef} />
}
