import clsx from "clsx"
import { useMemo } from "react"
import TocIcon from "remixicon-react/FileListLineIcon"

import { fabClassName } from "../components/Button"
import Menu, { type MenuActionProps } from "../components/Menu"
import { type TocItem } from "./helpers"

const TOC_LEVEL_GAP = 8

export interface FloatingTOCProps {
  toc?: TocItem[]
  highestLevel: number
  activeId?: string
  className?: string
}

export default function FloatingTOC({
  toc,
  highestLevel,
  className,
}: FloatingTOCProps): JSX.Element | null {
  const actions: MenuActionProps[] | undefined = useMemo(
    () =>
      toc?.map(({ id, text, level }) => ({
        id,
        children: (
          <span style={{ paddingLeft: (level - highestLevel) * TOC_LEVEL_GAP }}>
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
        className,
        "fixed bottom-4 left-4 z-popover m-1 rounded rounded-bl-xl",
        fabClassName,
      )}
    >
      <TocIcon aria-label="Table of contents" />
    </Menu>
  )
}
