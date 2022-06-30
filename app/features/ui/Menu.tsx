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

import { type To } from "./Link"

export interface MenuProps {
  className?: string
  children?: React.ReactNode
  actions: MenuActionProps[]
}

export type MenuActionProps = {
  id: string
  children: React.ReactNode
} & ({ to: To } | { onSelect: MenuItemProps["onSelect"] })

export default function Menu({
  className,
  children,
  actions,
}: MenuProps): JSX.Element | null {
  const actionClassName = clsx(
    "px-4 py-2 text-secondary",
    "[&[data-selected]]:bg-blue-800 [&[data-selected]]:text-primary",
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
              "bg-primary dark:bg-tertiary rounded border border-solid border-gray-500",
              "block outline-none shadow-lg overflow-y-auto",
              "z-popover absolute [&[hidden]]:hidden max-h-screen-main",
            )}
          >
            <MenuItems className="py-2 whitespace-nowrap ">
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
          </MenuPopover>
        </>
      )}
    </ReachMenu>
  )
}

Menu.Button = MenuButton
