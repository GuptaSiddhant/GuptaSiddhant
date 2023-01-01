import { useEffect, useLayoutEffect } from "react";

const useSafeLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export default useSafeLayoutEffect;
