import { useRef } from "react";

import useSafeLayoutEffect from "./useSafeLayoutEffect";

export default function usePreviousValue<T>(value: T): T {
  const ref = useRef<T>(value);

  useSafeLayoutEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
