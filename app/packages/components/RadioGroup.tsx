import clsx from "clsx"
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  type ReactNode,
} from "react"

export interface RadioGroupProps extends ComponentPropsWithoutRef<"fieldset"> {
  options: InputWithLabelProps[]
  value?: string
  name: string
}

export default function RadioGroup({
  options,
  value,
  name,
  className,
  ...props
}: RadioGroupProps): JSX.Element {
  return (
    <fieldset
      {...props}
      name={name}
      className={clsx(
        className,
        "rounded overflow-hidden",
        "outline-1 outline-black focus-within:outline",
      )}
    >
      {options.map((props) => {
        const id = props.id || `radio-${props.name}-${props.value}`

        return (
          <RadioButton
            key={id}
            id={id}
            name={name}
            checked={value === props.value}
            {...props}
          />
        )
      })}
    </fieldset>
  )
}

export type InputWithLabelProps = ComponentPropsWithoutRef<"input"> & {
  inputRef?: ForwardedRef<HTMLInputElement> | null
  label: ReactNode
}

function RadioButton({
  id,
  label,
  title,
  className,
  ...props
}: InputWithLabelProps) {
  return (
    <label htmlFor={id} className={clsx("w-full")} title={title}>
      <input
        id={id}
        type="radio"
        className="peer absolute scale-0"
        onChange={() => {}}
        {...props}
      />
      <div
        className={clsx(
          className,
          "px-4 py-2 min-h-input w-full",
          "bg-secondary hocus:bg-tertiary peer-focus:bg-tertiary",
          "peer-checked:bg-default",
          "text-secondary hocus:text-tertiary",
          "flex items-center justify-center",
        )}
      >
        {label}
      </div>
    </label>
  )
}
