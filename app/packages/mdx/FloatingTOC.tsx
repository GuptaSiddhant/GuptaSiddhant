import clsx from "clsx"
import { useMemo } from "react"
import TocIcon from "remixicon-react/FileListLineIcon"

import { fabClassName } from "../components/Button"
import Menu, { type MenuActionProps } from "../components/Menu"
import { type TocItem } from "./helpers"

export interface FloatingTOCProps {
  toc?: TocItem[]
  highestLevel: number
  maxLevel: number
  activeId?: string
}

export default function FloatingTOC({
  toc,
  highestLevel,
}: FloatingTOCProps): JSX.Element | null {
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
  if (diff === 2) return "pl-4"
  if (diff === 3) return "pl-6"
  if (diff === 4) return "pl-8"
  if (diff === 5) return "pl-10"
  return "pl-0"
}
