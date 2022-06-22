import clsx from "clsx"
import { useMemo } from "react"
import TocIcon from "remixicon-react/FileListLineIcon"

import { type TocItem } from "~/features/helpers/table-of-contents"

import { fabBottomLeftClassName } from "../ui/Button"
import Menu, { type MenuActionProps } from "../ui/Menu"

const TOC_LEVEL_GAP = 8

export interface TocFloatingProps {
  toc?: TocItem[]
  highestLevel: number
  activeId?: string
  className?: string
}

export default function TocFloating({
  toc,
  highestLevel,
  className,
}: TocFloatingProps): JSX.Element | null {
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

  if (!actions || actions.length === 0) return null

  return (
    <Menu actions={actions} className={clsx(className, fabBottomLeftClassName)}>
      <TocIcon aria-label="Table of contents" />
    </Menu>
  )
}
