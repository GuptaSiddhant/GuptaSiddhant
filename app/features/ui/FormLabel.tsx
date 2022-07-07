import clsx from "clsx"

export interface FormLabelProps {
  title?: string
  className?: string
  label?: React.ReactNode
  children: React.ReactNode
  htmlFor: string
  onClick?: React.MouseEventHandler<HTMLLabelElement>
  vertical?: boolean
}

export default function FormLabel({
  title,
  className,
  label,
  children,
  htmlFor,
  onClick,
  vertical,
}: FormLabelProps): JSX.Element | null {
  const styleClassName = clsx(
    "bg-secondary hocus-within:bg-tertiary",
    "text-secondary hocus-within:text-tertiary",
  )

  return (
    <fieldset
      title={title}
      className={clsx(
        className,
        "relative flex min-w-min",
        vertical
          ? "flex-col"
          : [
              "min-h-input flex-row items-center gap-1 rounded px-2 text-base",
              styleClassName,
            ],
      )}
    >
      {label ? (
        <label
          htmlFor={htmlFor}
          onClick={onClick}
          className="leading-none peer-required:after:text-negative peer-required:after:content-['*']"
        >
          {label}
        </label>
      ) : null}

      {vertical ? (
        <div
          className={clsx(
            styleClassName,
            "flex h-full min-h-input items-center gap-1 rounded text-base",
          )}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </fieldset>
  )
}
