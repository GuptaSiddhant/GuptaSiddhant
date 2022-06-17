import { useEffect, useRef } from "react"

export interface UseEventListenerOptions {
  immediate?: boolean
  target?: Window | Document | HTMLElement | EventTarget | MediaQueryList
}

export default function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  callback: (e: WindowEventMap[K]) => void,
  options?: UseEventListenerOptions,
) {
  const listenerRef = useRef(callback)
  const { immediate = false, target = __IS_SERVER__ ? undefined : window } =
    options || {}

  useEffect(() => {
    listenerRef.current = callback
  }, [callback])

  useEffect(() => {
    if (immediate) listenerRef.current?.({} as WindowEventMap[K])

    target?.addEventListener(eventName, listenerRef.current as any)
    return () =>
      target?.removeEventListener(eventName, listenerRef.current as any)
  }, [eventName, immediate, target])
}
