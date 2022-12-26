import { useEffect } from "react";

import useStableCallback from "./useStableCallback";

export interface UseEventListenerOptions {
  immediate?: boolean;
  target?: Window | Document | HTMLElement | EventTarget | MediaQueryList;
}

export default function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  callback: (e: WindowEventMap[K]) => void,
  options?: UseEventListenerOptions,
) {
  const listener = useStableCallback(callback);
  const { immediate = false, target = __IS_SERVER__ ? undefined : window } =
    options || {};

  useEffect(() => {
    if (immediate) {
      listener?.({} as WindowEventMap[K]);
    }

    // rome-ignore lint/suspicious/noExplicitAny: Complex
    (target || window)?.addEventListener(eventName, listener as any);

    return () => {
      // rome-ignore lint/suspicious/noExplicitAny: Complex
      (target || window)?.removeEventListener(eventName, listener as any);
    };
  }, [eventName, immediate, target, listener]);
}
