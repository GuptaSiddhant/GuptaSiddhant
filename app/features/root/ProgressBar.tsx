import { useTransition } from "@remix-run/react"
import { type RefObject, useCallback, useEffect, useRef } from "react"

import { CSS_VAR_HEADER_HEIGHT } from "~/features/constants"

export default function ProgressBar(): JSX.Element {
  const elementRef = useProgress()

  return (
    <div
      id="progress-bar"
      className="fixed left-0 right-0 z-[19] mx-4 flex h-0.5"
      style={{ top: `var(${CSS_VAR_HEADER_HEIGHT})` }}
    >
      <div
        ref={elementRef}
        className="bg-progress transition-[width] ease-out"
      />
    </div>
  )
}

/**
 * @see https://gist.github.com/edmundhung/023e85cc731466bb5f4b350590ab30ea
 */
function useProgress(): RefObject<HTMLDivElement> {
  const elementRef = useRef<HTMLDivElement>(null)
  const timeout = useRef<NodeJS.Timeout>()
  const { location } = useTransition()

  const updateWidth = useCallback(
    (ms: number) => {
      const element = elementRef.current
      if (!element) return

      timeout.current = setTimeout(() => {
        const width = parseFloat(element.style.width)
        const percent = !isNaN(width) ? 10 + 0.9 * width : 0
        element.style.width = `${percent}%`
        updateWidth(100)
      }, ms)
    },
    [elementRef],
  )

  useEffect(() => {
    if (!location || !elementRef.current) return
    if (timeout.current) clearTimeout(timeout.current)

    const element = elementRef.current
    element.style.width = `0%`
    updateWidth(300)

    return () => {
      if (timeout.current) clearTimeout(timeout.current)

      if (element.style.width === `0%`) return

      element.style.width = `100%`
      timeout.current = setTimeout(() => {
        if (element?.style.width !== "100%") return
        element.style.width = ``
      }, 200)
    }
  }, [location, elementRef, updateWidth])

  return elementRef
}
