import clsx from "clsx"
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
} from "react"
import CopyIcon from "remixicon-react/FileCopyLineIcon"

import useCopy from "~/packages/hooks/useCopy"

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  buttonRef?: ForwardedRef<HTMLButtonElement> | null
}

export default function Button({
  className,
  buttonRef,
  ...props
}: ButtonProps): JSX.Element {
  return (
    <button
      {...props}
      ref={buttonRef}
      className={clsx(
        "flex items-center gap-2",
        "cursor-pointer rounded",
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

export function PrimaryButton(props: ButtonProps): JSX.Element | null {
  return (
    <Button
      {...props}
      className={clsx(
        "px-4 h-10 flex items-center disabled:cursor-not-allowed",
        "bg-secondary disabled:bg-disabled/10 hocus:enabled:bg-tertiary ",
        "text-secondary disabled:text-disabled/50 hocus:enabled:text-tertiary",
      )}
    />
  )
}

export const fabClassName = clsx(
  "bg-default text-tertiary hocus:text-secondary p-2 text-sm",
)
export const fabBottomLeftClassName = clsx(
  fabClassName,
  "fixed bottom-4 left-4 z-popover m-1 rounded rounded-bl-xl",
)

export function FAB(props: ButtonProps): JSX.Element | null {
  return <Button {...props} className={clsx(props.className, fabClassName)} />
}

export function CopyButton({
  children,
  className,
}: {
  children: string
  className?: string
}): JSX.Element | null {
  const [copied, copy, isAvailable] = useCopy(children)

  if (!children) return null

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
