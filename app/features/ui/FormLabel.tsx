import clsx from "clsx"

export interface FormLabelProps {
  title?: string
  className?: string
  label?: React.ReactNode
  children: React.ReactNode
  htmlFor: string
  onClick?: React.MouseEventHandler<HTMLLabelElement>
}

export default function FormLabel({
  title,
  className,
  label,
  children,
  htmlFor,
  onClick,
}: FormLabelProps): JSX.Element | null {
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
        <label
          htmlFor={htmlFor}
          onClick={onClick}
          className="peer-required:after:text-negative peer-required:after:content-['*']"
        >
          {label}
        </label>
      ) : null}

      {children}
    </fieldset>
  )
}
