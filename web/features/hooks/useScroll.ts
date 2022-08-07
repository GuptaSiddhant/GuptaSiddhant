import { useMemo } from "react"

import { DEFAULT_SCROLL_OFFSET } from "@gs/constants"

import useElementStore from "./useElementStore"
import usePreviousValue from "./usePreviousValue"
import useWindowStore from "./useWindowStore"

export enum ScrollDirection {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal",
}

export interface ScrollState {
  scrollDistance: number
  scrollDistanceRatio: number

  isScrollStarted: boolean
  isScrollCompleted: boolean
  isOffsetCrossed: boolean
  isScrollingForward: boolean
  maxScrollDistance: number
}

export interface ScrollOptions {
  offset?: number
  direction?: ScrollDirection
}

export function useScrollWindow({
  offset,
  direction,
}: ScrollOptions = {}): ScrollState {
  const scrollDistance = useWindowStore(
    "scroll",
    () =>
      direction === ScrollDirection.HORIZONTAL
        ? window.scrollX
        : window.scrollY,
    () => 0,
  )

  const maxScrollDistance = useWindowStore(
    "scroll",
    () => {
      const documentElement = window.document.documentElement

      return direction === ScrollDirection.HORIZONTAL
        ? documentElement.scrollWidth - documentElement.clientWidth
        : documentElement.scrollHeight - documentElement.clientHeight
    },
    () => 0,
  )

  return useDeriveScrollState(scrollDistance, maxScrollDistance, offset)
}

export default useScrollWindow

export function useScrollElement(
  elementRef: React.RefObject<HTMLElement>,
  { offset, direction }: ScrollOptions = {},
): ScrollState {
  const scrollDistance = useElementStore(
    elementRef,
    "scroll",
    () => {
      const element = elementRef.current
      if (!element) return 0
      return direction === ScrollDirection.HORIZONTAL
        ? element.scrollLeft
        : element.scrollTop
    },
    () => 0,
  )

  /** Minimum value is set to "1" so divideByZero does not occur in ratio. */
  const maxScrollDistance = useWindowStore(
    "scroll",
    () => {
      const element = elementRef.current
      if (!element) return 1

      const { width, height } = element.getBoundingClientRect()
      return direction === ScrollDirection.HORIZONTAL
        ? Math.max(element.scrollWidth - width, 1)
        : Math.max(element.scrollHeight - height, 1)
    },

    () => 1,
  )

  return useDeriveScrollState(scrollDistance, maxScrollDistance, offset)
}

function useDeriveScrollState(
  scrollDistance: number,
  maxScrollDistance: number,
  offset: number = DEFAULT_SCROLL_OFFSET,
): ScrollState {
  const previousScrollDistance = usePreviousValue(scrollDistance)

  return useMemo(
    () => ({
      scrollDistance,
      maxScrollDistance,
      isScrollStarted: scrollDistance > 0,
      isScrollCompleted: scrollDistance >= maxScrollDistance - 1,
      isOffsetCrossed: scrollDistance > offset,
      isScrollingForward: scrollDistance >= previousScrollDistance,
      scrollDistanceRatio: scrollDistance / maxScrollDistance,
    }),
    [scrollDistance, offset, previousScrollDistance, maxScrollDistance],
  )
}
