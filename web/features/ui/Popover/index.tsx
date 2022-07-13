import useEventListener from "@gs/hooks/useEventListener"
import useFocusTrap from "@gs/hooks/useFocusTrap"
import useStableCallback from "@gs/hooks/useStableCallback"
import ReachPopover, { positionDefault } from "@reach/popover"
import clsx from "clsx"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import invariant from "tiny-invariant"

interface PopoverContextValue<T extends HTMLElement> {
  isOpen: boolean
  closePopover: () => void
  initialFocusRef: React.RefObject<T>
}

const PopoverContext = createContext<PopoverContextValue<any> | undefined>(
  undefined,
)

export interface PopoverProps {
  children:
    | React.ReactNode
    | ((props: {
        isOpen: boolean
        closePopover: () => void
      }) => React.ReactNode)
  className?: string
  title?: string
  content: React.ReactNode
}

const popoverClassName = clsx(
  "rounded border border-solid border-gray-500 bg-primary dark:bg-tertiary",
  "block overflow-y-auto shadow-lg outline-none",
  "z-popover max-h-screen-main [&[hidden]]:hidden",
)

export default function Popover({
  children,
  content,
  className,
  title,
}: PopoverProps): JSX.Element | null {
  const {
    isOpen,
    closePopover,
    toggleIsPopoverOpen,
    targetButtonRef,
    initialFocusRef,
    popoverRef,
  } = usePopover()

  return (
    <>
      <button
        ref={targetButtonRef}
        type="button"
        className={clsx("gap-2 flex-center", className)}
        title={title}
        onClick={toggleIsPopoverOpen}
      >
        {typeof children === "function"
          ? children({ isOpen, closePopover })
          : children}
      </button>
      <ReachPopover
        targetRef={targetButtonRef}
        position={positionDefault}
        className={popoverClassName}
        hidden={!isOpen}
        ref={popoverRef}
      >
        <PopoverContext.Provider
          value={{ closePopover, initialFocusRef, isOpen }}
        >
          {content}
        </PopoverContext.Provider>
      </ReachPopover>
    </>
  )
}

function usePopover() {
  const [isOpen, setIsOpen] = useState(false)

  const popoverRef = useFocusTrap(!isOpen)
  const targetButtonRef = useRef<HTMLButtonElement>(null)
  const initialFocusRef = useRef<HTMLElement>(null)

  const toggleIsPopoverOpen = useStableCallback(() => {
    setIsOpen((isOpen) => {
      if (!isOpen) return true

      targetButtonRef.current?.focus()
      return false
    })
  })

  useEffect(() => {
    if (isOpen) initialFocusRef.current?.focus()
  }, [isOpen])

  const openPopover = useStableCallback(() => setIsOpen(true))

  const closePopover = useStableCallback(() => {
    setIsOpen(false)
    targetButtonRef.current?.focus()
  })

  useEventListener(
    "keydown",
    (e) => e.key === "Escape" && isOpen && closePopover(),
    { target: popoverRef.current! },
  )

  useEventListener(
    "click",
    (e) => {
      if (!isOpen) return
      if (popoverRef.current?.contains(e.target as Node)) return
      if (targetButtonRef.current?.contains(e.target as Node)) return

      closePopover()
    },
    {},
  )

  return {
    isOpen,
    openPopover,
    closePopover,
    toggleIsPopoverOpen,
    popoverRef,
    targetButtonRef,
    initialFocusRef,
  }
}

export function usePopoverContext<
  T extends HTMLElement = HTMLButtonElement,
>(): PopoverContextValue<T> {
  const context = useContext(PopoverContext)
  invariant(context, "PopoverContext must be used within a Popover")

  return context
}
