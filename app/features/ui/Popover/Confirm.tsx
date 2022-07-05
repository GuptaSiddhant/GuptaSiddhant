import clsx from "clsx"

import { usePopoverContext } from "."

export interface PopoverConfirmProps {
  children?: React.ReactNode
  cancelElement?: React.ReactNode
  confirmElement?: React.ReactNode
  onCancel?: () => void
  onConfirm: () => void
}

export default function PopoverConfirmContent({
  children,
  cancelElement = "No",
  confirmElement = "Yes",
  onCancel = () => {},
  onConfirm,
}: PopoverConfirmProps): JSX.Element | null {
  const { closePopover, initialFocusRef } = usePopoverContext()

  const actionClassName = clsx(
    "px-4 py-1 text-secondary",
    "hover:bg-blue-200 dark:hover:bg-blue-800",
    "[&[data-selected]]:text-primary",
  )

  const handleCancel = () => {
    onCancel?.()
    closePopover()
  }
  const handleConfirm = () => {
    onConfirm()
    closePopover()
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <p>{children || "Are you sure?"}</p>
      <ul className="flex w-full flex-row justify-end gap-2">
        <button
          ref={initialFocusRef}
          key="cancel"
          className={actionClassName}
          onClick={handleCancel}
        >
          {cancelElement}
        </button>
        <button key="ok" className={actionClassName} onClick={handleConfirm}>
          {confirmElement}
        </button>
      </ul>
    </div>
  )
}
