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
}

export default function Input({
  id,
  name,
  inputRef,
  className,
  datalist,
  ...props
}: InputProps) {
  const inputId = id || name
  const datalistId = `${inputId}-datalist`

  return (
    <label htmlFor={inputId}>
      <input
        ref={inputRef}
        id={inputId}
        {...props}
        list={datalistId}
        className={clsx(
          className,
          "bg-default flex-1 rounded px-2 py-1 text-base",
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
