import { useEffect, useRef } from "react"

export default function useTimeout(
  callback: () => void,
  timeoutInMs: number,
  isPaused?: boolean,
): number {
  const startTimeRef = useRef<number>(0)
  const remainingTimeRef = useRef<number>(timeoutInMs)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isPaused) {
      clearTimeout(timeoutRef.current)
      remainingTimeRef.current -= Date.now() - startTimeRef.current
    } else {
      startTimeRef.current = Date.now()
      timeoutRef.current = setTimeout(callback, remainingTimeRef.current)

      return () => clearTimeout(timeoutRef.current)
    }
  }, [callback, isPaused])

  return remainingTimeRef.current
}
