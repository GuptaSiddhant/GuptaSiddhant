import { useRef, useSyncExternalStore } from "react"

type EventMap = WindowEventMap

/**
 * Sync the value of a property of a
 * window object with the state of a React.
 *
 * @param eventType Window event
 * @param getState Client state getter
 * @param getServerState Server state getter
 * @returns Current state
 */
export default function useWindowStore<T, K extends keyof EventMap>(
  eventType: K,
  getState: (e?: EventMap[K]) => T,
  getServerState?: () => T,
): T {
  const eventRef = useRef<EventMap[K]>()

  return useSyncExternalStore(
    (callback) => {
      const listener = (event: EventMap[K]) => {
        eventRef.current = event
        callback()
      }
      window.addEventListener(eventType, listener, { passive: true })

      return () => window.removeEventListener(eventType, listener)
    },
    () => getState(eventRef.current),
    getServerState,
  )
}
