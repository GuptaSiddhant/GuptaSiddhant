import { useRef } from "react"

import useSafeLayoutEffect from "./useSafeLayoutEffect"
import useStableCallback from "./useStableCallback"

interface CallbackProps {
  time: number
  delta: number
}

// Reusable component that also takes dependencies
export default (cb: (props: CallbackProps) => void) => {
  if (typeof performance === "undefined" || typeof window === "undefined") {
    return
  }

  const cbRef = useRef<(props: CallbackProps) => void>()
  const frame = useRef<number>()
  const init = useRef(performance.now())
  const last = useRef(performance.now())

  cbRef.current = cb

  const animate = useStableCallback((now: number) => {
    // In Ms
    cbRef.current?.({
      time: now - init.current,
      delta: now - last.current,
    })
    last.current = now
    frame.current = requestAnimationFrame(animate)
  })

  useSafeLayoutEffect(() => {
    frame.current = requestAnimationFrame(animate)

    return () => {
      frame.current && cancelAnimationFrame(frame.current)
    }
  }, [animate])
}
