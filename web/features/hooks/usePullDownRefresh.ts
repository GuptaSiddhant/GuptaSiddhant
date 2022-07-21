import { useRef } from "react"

import useEventListener from "./useEventListener"
import useStableCallback from "./useStableCallback"

export default function usePullDownRefresh() {
  const posStart = useRef({ x: 0, y: 0 })
  const posEnd = useRef({ x: 0, y: 0 })

  const swipeCheck = useStableCallback(() => {
    const changeY = posStart.current.y - posEnd.current.y
    const changeX = posStart.current.x - posEnd.current.x
    const isPulledDown = isPullDown(changeY, changeX)

    if (isPulledDown) window.location.reload()
  })

  const swipeStart = useStableCallback((e: TouchEvent) => {
    if ("targetTouches" in e && e.targetTouches.length > 0) {
      const touch = e.targetTouches[0]
      posStart.current = { x: touch.clientX, y: touch.clientY }
    }
  })

  const swipeEnd = useStableCallback((e: TouchEvent) => {
    if (
      "targetTouches" in e &&
      (e.targetTouches.length > 0 || e.changedTouches.length > 0)
    ) {
      const touch = e.targetTouches[0] || e.changedTouches[0]
      posEnd.current = { x: touch.clientX, y: touch.clientY }
    }

    swipeCheck()
  })

  useEventListener("touchstart", swipeStart)
  useEventListener("touchend", swipeEnd)
}

function isPullDown(dY: number, dX: number) {
  // methods of checking slope, length, direction of line created by swipe action
  return (
    dY < 0 &&
    ((Math.abs(dX) <= 100 && Math.abs(dY) >= 300) ||
      (Math.abs(dX) / Math.abs(dY) <= 0.3 && dY >= 60))
  )
}
