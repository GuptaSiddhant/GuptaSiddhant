import clsx from "clsx"
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
} from "react"

export type InputProps = ComponentPropsWithoutRef<"input"> & {
  inputRef?: ForwardedRef<HTMLInputElement> | null
  datalist?: string[]
  name: string
  label?: React.ReactNode
  labelClassName?: string
}

export default function Input({
  id,
  name,
  inputRef,
  className,
  datalist,
  label,
  labelClassName,
  ...props
}: InputProps) {
  const inputId = id || name
  const datalistId = `${inputId}-datalist`

  return (
    <label htmlFor={inputId} className={labelClassName}>
      {label}
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        {...props}
        list={datalistId}
        className={clsx(
          className,
          "peer flex-1 rounded bg-default px-2 py-1 text-base",
          "read-only:text-disabled disabled:text-disabled",
        )}
      />
      {datalist && datalist.length > 0 ? (
        <datalist id={datalistId}>
          {datalist.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      ) : null}
    </label>
  )
}

export const InputWithRef = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input"> & { name: string }
>(function InputWithRef(props, ref) {
  return <Input {...props} inputRef={ref} />
})
