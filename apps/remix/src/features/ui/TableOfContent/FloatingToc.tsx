import clsx from "clsx";
import { useMemo } from "react";
import TocIcon from "remixicon-react/FileListLineIcon";

import { fabBottomLeftClassName } from "@gs/ui/Button";
import Menu, { type MenuActionProps } from "@gs/ui/Menu";

import type { TableOfContentProps } from "./types";

const TOC_LEVEL_GAP = 8;

export default function FloatingTableOfContent({
  toc,
  highestLevel,
  className,
  activeId,
}: TableOfContentProps): JSX.Element | null {
  const actions: MenuActionProps[] | undefined = useMemo(
    () =>
      toc?.map(({ id, text, level }) => {
        const isActive = activeId?.toLowerCase() === id.toLowerCase();

        return {
          id,
          children: (
            <span
              style={{
                paddingLeft: (level - highestLevel) * TOC_LEVEL_GAP,
                fontWeight: isActive ? "bold" : "normal",
              }}
            >
              {text}
            </span>
          ),
          to: `#${id}`,
        };
      }),
    [toc, highestLevel, activeId],
  );

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <Menu actions={actions} className={clsx(className, fabBottomLeftClassName)}>
      <TocIcon aria-label="Table of contents" />
    </Menu>
  );
}
