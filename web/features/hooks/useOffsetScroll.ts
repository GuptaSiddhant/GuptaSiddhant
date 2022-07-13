import { __IS_SERVER_WIN__, DEFAULT_SCROLL_OFFSET } from "@gs/constants"
import { useReducer, useRef } from "react"

import useEventListener from "./useEventListener"
import useThrottle from "./useThrottle"

interface OffsetScrollState {
  scrollTop: number
  isOffsetScrolled: boolean
  scrollDirection: "up" | "down"
}

const initialState: OffsetScrollState = {
  scrollTop: 0,
  isOffsetScrolled: false,
  scrollDirection: "down",
}

export default function useOffsetScroll(
  offsetY: number = DEFAULT_SCROLL_OFFSET,
): OffsetScrollState {
  const lastScrollTopRef = useRef(__IS_SERVER_WIN__ ? 0 : window.pageYOffset)
  const [state, dispatch] = useReducer(
    (state: OffsetScrollState, payload: Partial<OffsetScrollState>) => ({
      ...state,
      ...payload,
    }),
    initialState,
  )

  const [throttledHandler] = useThrottle(() => {
    const scrollTop = window.scrollY || 0
    const isOffsetScrolled = scrollTop > offsetY
    const scrollDirection =
      scrollTop >= lastScrollTopRef.current ? "down" : "up"

    lastScrollTopRef.current = Math.max(scrollTop, 0)
    dispatch({ scrollTop, isOffsetScrolled, scrollDirection })
  }, 500)

  useEventListener("scroll", throttledHandler, { immediate: true })

  return state
}
