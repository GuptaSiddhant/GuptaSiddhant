import { useEffect, useMemo, useState } from "react";

import { useLocation } from "@remix-run/react";

import useEventListener from "@gs/hooks/useEventListener";

import { __IS_SERVER_WIN__ } from "../../constants";
import useThrottle from "../../hooks/useThrottle";
import type { TocItem } from "./types";

export function arrangeTocByLevels(
  toc: TocItem[],
  currentItem: TocItem,
  currentIndex: number,
  originalList: TocItem[],
) {
  const currentLevel = currentItem.level;
  const parentIndex = toc.findIndex((i) => currentLevel > i.level) > -1;
  if (parentIndex) {
    return toc;
  }

  const nextElementIndexWithSameLevel = originalList
    .slice(currentIndex + 1)
    .find((i) => i.level === currentLevel);
  const nextIndex = nextElementIndexWithSameLevel
    ? originalList.indexOf(nextElementIndexWithSameLevel)
    : originalList.length;
  const subArray = originalList.slice(currentIndex + 1, nextIndex);
  currentItem.children = [...subArray.reduce(arrangeTocByLevels, [])];

  return [...toc, currentItem];
}

export function useCurrentActiveId(toc: TocItem[]): string {
  const [activeId, setActiveId] = useState<string>("");

  const { hash } = useLocation();
  useEffect(() => {
    const id = hash.replace("#", "");
    if (toc.find((item) => item.id === id)) {
      setActiveId(id);
    }
  }, [toc, hash]);

  const elements = useMemo(
    () =>
      toc.map(({ id }) =>
        __IS_SERVER_WIN__ ? null : document.getElementById(id),
      ),
    [toc],
  );

  const [throttledHandler] = useThrottle(() => {
    const lastElementAfterScroll = elements.filter((element) => {
      if (!element) {
        return false;
      }

      const elementTop = element.getBoundingClientRect().top;
      const elementPositionTop = elementTop;

      return elementPositionTop <= 100;
    })[
      elements.filter((element) => {
        if (!element) {
          return false;
        }

        const elementTop = element.getBoundingClientRect().top;
        const elementPositionTop = elementTop;

        return elementPositionTop <= 100;
      }).length - 1
    ];

    if (lastElementAfterScroll) {
      setActiveId(lastElementAfterScroll.id);
    }
  }, 500);

  useEventListener("scroll", throttledHandler, { immediate: true });

  return activeId;
}
