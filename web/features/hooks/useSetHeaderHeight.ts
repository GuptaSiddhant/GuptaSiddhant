import { CSS_VAR_HEADER_HEIGHT } from "@gs/constants"
import useEventListener from "@gs/hooks/useEventListener"
import { useRef } from "react"

export default function useSetHeaderHeight() {
  const ref = useRef<HTMLElement>(null)

  useEventListener(
    "resize",
    () => {
      const headerHeight = ref.current?.getBoundingClientRect().height || 0

      document.documentElement.style.setProperty(
        CSS_VAR_HEADER_HEIGHT,
        `${headerHeight}px`,
      )
    },
    { immediate: true },
  )

  return ref
}