import { useEffect, useRef } from "react";

export default function useInterval(
  callback: () => void,
  intervalInMs: number,
  isPaused?: boolean,
) {
  const startTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(intervalInMs);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalRef.current);
      remainingTimeRef.current -= Date.now() - startTimeRef.current;
    } else {
      startTimeRef.current = Date.now();
      intervalRef.current = window.setInterval(
        callback,
        remainingTimeRef.current,
      );

      return () => clearInterval(intervalRef.current);
    }
  }, [callback, isPaused]);
}
