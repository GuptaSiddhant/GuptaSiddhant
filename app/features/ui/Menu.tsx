import {
  type MenuItemProps,
  MenuItem,
  MenuItems,
  MenuLink,
} from "@reach/menu-button"
import { Link } from "@remix-run/react"
import clsx from "clsx"
import CloseIcon from "remixicon-react/CloseCircleLineIcon"

import type { To } from "~/features/types"

import Popover from "./Popover"

export interface MenuProps {
  className?: string
  children?: React.ReactNode
  actions: MenuActionProps[]
  header?: React.ReactNode
  footer?: React.ReactNode
}

export type MenuActionProps = {
  id: string
  children: React.ReactNode
} & ({ to: To } | { onSelect: MenuItemProps["onSelect"] })

const actionClassName = clsx(
  "px-4 py-2 text-secondary",
  "[&[data-selected]]:bg-blue-200 dark:[&[data-selected]]:bg-blue-800",
  "[&[data-selected]]:text-primary",
)

export default function Menu({
  className,
  children,
  actions,
  header,
  footer,
}: MenuProps): JSX.Element | null {
  return (
    <Popover
      className={className}
      content={
        <>
          {header}

          <MenuItems className="whitespace-nowrap py-2">
            {actions.map((props) =>
              "to" in props ? (
                <MenuLink
                  key={props.id}
                  {...props}
                  as={Link}
                  replace
                  className={actionClassName}
                />
              ) : (
                <MenuItem
                  key={props.id}
                  {...props}
                  className={actionClassName}
                />
              ),
            )}
          </MenuItems>

          {footer}
        </>
      }
    >
      {({ isOpen }) =>
        isOpen ? <CloseIcon aria-label="Close menu" /> : children
      }
    </Popover>
  )
}
