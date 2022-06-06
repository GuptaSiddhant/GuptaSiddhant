import useCopy from "~/packages/hooks/useCopy"
import clsx from "clsx"
import {
  forwardRef,
  type ForwardedRef,
  type ComponentPropsWithoutRef,
} from "react"
import CopyIcon from "remixicon-react/FileCopyLineIcon"

export default function Button({
  className,
  buttonRef,
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  buttonRef?: ForwardedRef<HTMLButtonElement> | null
}): JSX.Element {
  return (
    <button
      {...props}
      ref={buttonRef}
      className={clsx(
        "flex items-center p-2",
        "cursor-pointer text-sm rounded",
        "bg-default text-tertiary hover:text-secondary",
        className,
      )}
    />
  )
}

export const ButtonWithRef = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(function ButtonWithRef(props, ref) {
  return <Button {...props} buttonRef={ref} />
})

export function CopyButton({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const [copied, copy, isAvailable] = useCopy(children)

  return isAvailable ? (
    <button
      title={copied ? "Copied to clipboard" : "Click to copy"}
      onClick={copy}
      className={clsx(className, "select-none")}
    >
      {copied ? "✅" : <CopyIcon size={"1em"} />}
    </button>
  ) : null
}
