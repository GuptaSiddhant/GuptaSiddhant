import { useCallback, useRef } from "react"

import useSafeLayoutEffect from "./useSafeLayoutEffect"

export default function useStableCallback<T extends Array<unknown>, R>(
  callback: (...args: T) => R,
): (...args: T) => R {
  const ref = useRef(callback)

  useSafeLayoutEffect(() => {
    ref.current = callback
  })

  const stableCallback = useCallback((...args: T) => ref.current(...args), [])

  return stableCallback
}
