import clsx from "clsx"
import { useState } from "react"

import useBlockNativeScroll from "../hooks/useBlockNativeScroll"
import useEventListener from "../hooks/useEventListener"
import useFocusTrap from "../hooks/useFocusTrap"
import useStableCallback from "../hooks/useStableCallback"

export interface DialogProps {
  isOpen: boolean
  closeDialog: () => void
  dialogRef: React.RefObject<HTMLDialogElement>
  children: React.ReactNode
  id?: string
  className?: string
}

export default function Dialog({
  closeDialog,
  children,
  dialogRef,
  id,
  className,
  isOpen,
}: DialogProps): JSX.Element | null {
  useBlockNativeScroll(!isOpen)

  const handleDialogClick = useStableCallback(
    (e: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
      if (e.currentTarget.tagName !== "DIALOG") return
      const rect = e.currentTarget.getBoundingClientRect()
      const clickedInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width

      if (!clickedInDialog) {
        e.preventDefault()
        closeDialog()
      }
    },
  )

  useEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      e.preventDefault()
      return closeDialog()
    }
  })

  return (
    <dialog
      id={id}
      ref={dialogRef}
      onClick={handleDialogClick}
      className={clsx(
        className,
        "animate-appear-btt shadow-xl backdrop:bg-black/10",
        "-w-screen-m8 rounded-lg border border-divider lg:w-2/3 2xl:w-1/2",
        "bg-float text-default backdrop-blur-md",
        isOpen ? "block" : "hidden",
      )}
    >
      {children}
    </dialog>
  )
}

export function useDialog() {
  const dialogRef = useFocusTrap<HTMLDialogElement>()

  const [isOpen, setIsOpen] = useState(false)

  const openDialog = useStableCallback(() => {
    if (dialogRef.current?.open) return
    dialogRef.current?.showModal()
    setIsOpen(true)
  })
  const closeDialog = useStableCallback(() => {
    dialogRef.current?.close()
    setIsOpen(false)
  })

  const toggleDialogOpen = useStableCallback(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    return dialog.open ? closeDialog() : openDialog()
  })

  return {
    dialogRef,
    closeDialog,
    isOpen,
    openDialog,
    toggleDialogOpen,
  }
}
