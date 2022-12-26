import Button from "../Button"
import { H6 } from "../Text"
import { usePopoverContext } from "."

export interface PopoverConfirmProps {
  title?: React.ReactNode
  children?: React.ReactNode
  cancelElement?: React.ReactNode
  cancelClassName?: string
  confirmElement?: React.ReactNode
  confirmClassName?: string
  onCancel?: () => void
  onConfirm: () => void
}

export default function PopoverConfirmContent({
  title = "Confirm action",
  children,
  cancelElement = "No",
  confirmElement = "Yes",
  onCancel = () => {},
  onConfirm,
  cancelClassName,
  confirmClassName,
}: PopoverConfirmProps): JSX.Element | null {
  const { closePopover, initialFocusRef } = usePopoverContext()

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
      <H6>{title}</H6>
      <p>{children || "Are you sure?"}</p>
      <ul className="flex w-full flex-row justify-end gap-2">
        <Button.Secondary
          buttonRef={initialFocusRef}
          key="cancel"
          onClick={handleCancel}
          className={cancelClassName}
          type="button"
        >
          {cancelElement}
        </Button.Secondary>
        <Button.Primary
          key="ok"
          onClick={handleConfirm}
          className={confirmClassName}
          type="submit"
        >
          {confirmElement}
        </Button.Primary>
      </ul>
    </div>
  )
}

export function getDeleteConfirmProps(
  name: string = "item",
): Partial<PopoverConfirmProps> {
  return {
    children: `Are you sure you want to delete the ${name}?`,
    confirmElement: "Delete",
    confirmClassName: "!bg-negative !text-white",
  }
}
