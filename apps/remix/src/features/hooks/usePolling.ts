import type { SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";

import { type SubmitOptions, useLocation, useSubmit } from "@remix-run/react";

import type { RemixSubmitFunctionTarget } from "@gs/types";

import useEventListener from "./useEventListener";
import useStableCallback from "./useStableCallback";

interface UsePollingOptions {
  duration?: number;
  action?: SubmitOptions["action"];
  method: SubmitOptions["method"];
  target?: RemixSubmitFunctionTarget;
  defaultPause?: boolean;
}

export default function usePolling({
  defaultPause = false,
  action,
  target = null,
  duration = 5_000,
  method,
}: UsePollingOptions) {
  const submit = useSubmit();
  const { pathname } = useLocation();
  const [paused, setPaused] = useState(defaultPause);
  const userPausedPreferenceRef = useRef(paused);

  const poll = useStableCallback(() =>
    submit(target, { method, action: action || pathname, replace: true }),
  );

  useEffect(() => {
    if (paused) {
      return;
    }

    const interval = setInterval(poll, duration);
    return () => clearInterval(interval);
  }, [poll, paused, duration]);

  useEventListener("blur", () => setPaused(true));
  useEventListener("focus", () =>
    setPaused(userPausedPreferenceRef.current ?? false),
  );

  const handlePaused = useStableCallback((props: SetStateAction<boolean>) => {
    setPaused((p) => {
      if (typeof props === "boolean") {
        userPausedPreferenceRef.current = props;
        return props;
      }

      const value = props(p);
      userPausedPreferenceRef.current = value;
      return value;
    });
  });

  return { paused, setPaused: handlePaused };
}

export function useLoaderPolling(
  body?: RemixSubmitFunctionTarget,
  options: { duration?: number; defaultPause?: boolean } = {},
) {
  return usePolling({
    method: "get",
    target: body,
    ...options,
  });
}
