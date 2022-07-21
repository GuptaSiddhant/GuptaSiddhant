import clsx from "clsx"
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
} from "react"
import CopyIcon from "remixicon-react/FileCopyLineIcon"
import FullscreenExitIcon from "remixicon-react/FullscreenExitLineIcon"
import FullscreenEnterIcon from "remixicon-react/FullscreenLineIcon"

import useCopy from "@gs/hooks/useCopy"

import type useFullscreen from "../hooks/useFullscreen"

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
      type="button"
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

Button.Primary = PrimaryButton
Button.Secondary = SecondaryButton

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
        props.className,
        "flex h-10 items-center px-4 disabled:cursor-not-allowed disabled:opacity-50 ",
        "bg-link text-inverse hocus:enabled:opacity-90",
      )}
    />
  )
}

export function SecondaryButton(props: ButtonProps): JSX.Element | null {
  return (
    <Button
      {...props}
      className={clsx(
        props.className,
        "flex h-10 items-center px-4 disabled:cursor-not-allowed disabled:opacity-50 ",
        "disabled:bg-disabled/10 bg-secondary hocus:enabled:bg-tertiary ",
        "disabled:text-disabled/50 text-secondary hocus:enabled:text-tertiary",
      )}
    />
  )
}

export const fabClassName = clsx(
  "bg-default text-tertiary hocus:text-secondary p-2 text-sm rounded z-popover fixed m-1",
)
export const fabBottomLeftClassName = clsx(
  fabClassName,
  "bottom-4 left-4 rounded-bl-xl",
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
    <Button
      title={copied ? "Copied to clipboard" : "Click to copy"}
      onClick={copy}
      className={clsx(className, "select-none")}
    >
      {copied ? "✅" : <CopyIcon size={"1em"} />}
    </Button>
  ) : null
}

export function FullscreenButton({
  isFullscreen,
  isFullscreenEnabled,
  toggleFullscreen,
}: ReturnType<typeof useFullscreen>): JSX.Element | null {
  if (!isFullscreenEnabled) return null

  return (
    <Button
      title={isFullscreen ? "Exit fullscreen" : "Go fullscreen"}
      onClick={(e) => {
        e.preventDefault()
        toggleFullscreen()
      }}
    >
      {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
    </Button>
  )
}
