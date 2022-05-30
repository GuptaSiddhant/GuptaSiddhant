import clsx from "clsx"
import {
  forwardRef,
  type ForwardedRef,
  type ComponentPropsWithoutRef,
} from "react"

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
        "bg-default text-disabled hover:text-tertiary",
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
