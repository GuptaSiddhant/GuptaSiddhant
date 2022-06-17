import { useCallback, useLayoutEffect, useRef } from "react"

export default function useStableCallback<T extends Array<unknown>, R>(
  callback: (...args: T) => R,
): (...args: T) => R {
  const ref = useRef(callback)

  useLayoutEffect(() => {
    ref.current = callback
  })

  const stableCallback = useCallback((...args: T) => ref.current(...args), [])

  return stableCallback
}
