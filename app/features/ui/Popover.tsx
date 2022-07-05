import {
  Menu as ReachMenu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuPopover,
} from "@reach/menu-button"
import { Link } from "@remix-run/react"
import clsx from "clsx"
import CloseIcon from "remixicon-react/CloseCircleLineIcon"

import { ButtonWithRef } from "./Button"

export interface PopoverProps {
  children:
    | React.ReactNode
    | ((props: { isOpen: boolean; isExpanded: boolean }) => React.ReactNode)
  content: React.ReactNode
  className?: string
}

const popoverClassName = clsx(
  "rounded border border-solid border-gray-500 bg-primary dark:bg-tertiary",
  "block overflow-y-auto shadow-lg outline-none",
  "absolute z-popover max-h-screen-main [&[hidden]]:hidden",
)

export default function Popover({
  children,
  content,
  className,
}: PopoverProps): JSX.Element | null {
  return (
    <ReachMenu>
      {({ isOpen, isExpanded }) => (
        <>
          <MenuButton as={ButtonWithRef} className={className}>
            {typeof children === "function"
              ? children?.({ isOpen, isExpanded })
              : children}
          </MenuButton>
          <MenuPopover className={popoverClassName}>{content}</MenuPopover>
        </>
      )}
    </ReachMenu>
  )
}

Popover.Confirm = PopoverConfirm

export interface PopoverConfirmProps {
  children?: React.ReactNode
  cancelElement?: React.ReactNode
  confirmElement?: React.ReactNode
  onCancel?: () => void
  onConfirm: () => void
}

function PopoverConfirm({
  children,
  cancelElement = "No",
  confirmElement = "Yes",
  onCancel = () => {},
  onConfirm,
}: PopoverConfirmProps): JSX.Element | null {
  const actionClassName = clsx(
    "px-4 py-2 text-secondary",
    "[&[data-selected]]:bg-blue-200 dark:[&[data-selected]]:bg-blue-800",
    "[&[data-selected]]:text-primary",
  )

  return (
    <div className="flex flex-col gap-2 p-4">
      <p>{children || "Are you sure?"}</p>
      <MenuItems className="flex w-full flex-row justify-end gap-2">
        <MenuItem key="cancel" className={actionClassName} onSelect={onCancel}>
          {cancelElement}
        </MenuItem>
        <MenuItem key="ok" className={actionClassName} onSelect={onConfirm}>
          {confirmElement}
        </MenuItem>
      </MenuItems>
    </div>
  )
}
