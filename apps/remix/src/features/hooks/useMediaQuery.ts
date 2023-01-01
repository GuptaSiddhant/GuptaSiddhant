import { useState } from "react";

import useEventListener from "./useEventListener";

export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEventListener(
    "change",
    () => setMatches(window.matchMedia(query).matches),
    {
      immediate: true,
      target: __IS_SERVER__ ? undefined : window.matchMedia(query),
    },
  );

  return matches;
}
