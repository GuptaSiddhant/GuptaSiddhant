import { useEffect, useRef } from "react"

export interface UseEventListenerOptions {
  immediate?: boolean
}

export default function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  callback: (e: WindowEventMap[K]) => void,
  options?: UseEventListenerOptions,
) {
  const listenerRef = useRef(callback)
  const { immediate = false } = options || {}

  useEffect(() => {
    listenerRef.current = callback
  }, [callback])

  useEffect(() => {
    if (immediate) listenerRef.current?.({} as WindowEventMap[K])

    window.addEventListener(eventName, listenerRef.current)
    return () => window.removeEventListener(eventName, listenerRef.current)
  }, [eventName, immediate])
}
