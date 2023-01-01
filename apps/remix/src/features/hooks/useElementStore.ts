import { type RefObject, useRef, useSyncExternalStore } from "react";

type EventMap = HTMLElementEventMap;

/**
 * Sync the value of a property of a
 * element object with the state of a React.
 *
 * @param element Element to sync with
 * @param eventType Window event
 * @param getState Client state getter
 * @param getServerState Server state getter
 * @returns Current state
 */
export default function useElementStore<T, K extends keyof EventMap>(
  elementRef: RefObject<HTMLElement>,
  eventType: K,
  getState: (e?: EventMap[K]) => T,
  getServerState?: () => T,
): T {
  const eventRef = useRef<EventMap[K]>();

  return useSyncExternalStore(
    (callback) => {
      const listener = (event: EventMap[K]) => {
        eventRef.current = event;
        callback();
      };

      elementRef.current?.addEventListener(eventType, listener);

      return () => elementRef.current?.removeEventListener(eventType, listener);
    },
    () => getState(eventRef.current),
    getServerState,
  );
}
