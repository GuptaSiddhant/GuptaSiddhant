import {
  type MenuItemProps,
  Menu as ReachMenu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuLink,
  MenuPopover,
} from "@reach/menu-button"
import { Link } from "@remix-run/react"
import clsx from "clsx"
import CloseIcon from "remixicon-react/CloseCircleLineIcon"

import type { To } from "@features/types"

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

export default function Menu({
  className,
  children,
  actions,
  header,
  footer,
}: MenuProps): JSX.Element | null {
  const actionClassName = clsx(
    "px-4 py-2 text-secondary",
    "[&[data-selected]]:bg-blue-200 dark:[&[data-selected]]:bg-blue-800",
    "[&[data-selected]]:text-primary",
  )

  return (
    <ReachMenu>
      {({ isOpen }) => (
        <>
          <MenuButton className={className}>
            {isOpen ? <CloseIcon aria-label="Close menu" /> : children}
          </MenuButton>
          <MenuPopover
            className={clsx(
              "rounded border border-solid border-gray-500 bg-primary dark:bg-tertiary",
              "block overflow-y-auto shadow-lg outline-none",
              "absolute z-popover max-h-screen-main [&[hidden]]:hidden",
            )}
          >
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
          </MenuPopover>
        </>
      )}
    </ReachMenu>
  )
}

Menu.Button = MenuButton
