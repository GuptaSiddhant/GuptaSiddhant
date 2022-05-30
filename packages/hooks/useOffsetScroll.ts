// import { __IS_SERVER__ } from "~/helpers"
import { useEffect, useReducer, useRef } from "react"
// import { DEFAULT_SCROLL_OFFSET } from "~/helpers/constants"
import useThrottle from "./useThrottle"

const __IS_SERVER__ = typeof document === "undefined"
const DEFAULT_SCROLL_OFFSET = 500

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
  const lastScrollTopRef = useRef(__IS_SERVER__ ? 0 : window.pageYOffset)
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

  useEffect(() => {
    window.addEventListener("scroll", throttledHandler)
    return () => window.removeEventListener("scroll", throttledHandler)
  }, [throttledHandler])

  return state
}
