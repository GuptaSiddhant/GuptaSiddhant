import clsx from "clsx"
import { useMemo } from "react"
import TocIcon from "remixicon-react/FileListLineIcon"

import { fabClassName } from "../components/Button"
import Menu, { type MenuActionProps } from "../components/Menu"
import { type TocItem } from "./helpers"

export interface TableOfContentsButtonProps {
  toc?: TocItem[]
  highestLevel: number
  maxLevel: number
  activeId?: string
}

export default function TableOfContentsButton({
  toc,
  highestLevel,
}: TableOfContentsButtonProps): JSX.Element | null {
  const actions: MenuActionProps[] | undefined = useMemo(
    () =>
      toc?.map(({ id, text, level }) => ({
        id,
        children: (
          <span className={generateClassNameForTocLevel(level, highestLevel)}>
            {text}
          </span>
        ),
        to: `#${id}`,
      })),
    [toc, highestLevel],
  )

  if (!actions) return null

  return (
    <Menu
      actions={actions}
      className={clsx(
        "fixed bottom-4 left-4 z-popover lg:hidden m-1 rounded-bl-xl",
        fabClassName,
      )}
    >
      <TocIcon aria-hidden />
      <span className="sr-only">Table of contents</span>
    </Menu>
  )
}

function generateClassNameForTocLevel(
  level: number,
  highestLevel: number,
): string {
  const diff = level - highestLevel
  if (diff === 1) return "pl-2"
  if (diff === 2) return "pl-2"

  return "pl-0"
}
