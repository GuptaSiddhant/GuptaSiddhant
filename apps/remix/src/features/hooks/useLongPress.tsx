import { useCallback, useEffect, useRef, useState } from "react";

export default function useLongPress<T extends React.RefObject<HTMLElement>>(
  ref: T,
  callback: () => void,
  delay = 1000,
) {
  const [isLongPressed, setIsLongPressed] = useState(false);
  const timeout = useRef<number>();

  const handleLongPress = useCallback(() => setIsLongPressed(true), []);
  const handleLongPressEnd = useCallback(() => {
    setIsLongPressed(false);
    clearTimeout(timeout.current);
  }, []);

  useEffect(() => {
    if (isLongPressed) {
      timeout.current = window.setTimeout(() => {
        setIsLongPressed(false);
        callback();
      }, delay);
    } else {
      clearTimeout(timeout.current);
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [isLongPressed, callback, delay]);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener("mousedown", handleLongPress);
      element.addEventListener("mouseup", handleLongPressEnd);
      element.addEventListener("touchstart", handleLongPress, {
        passive: true,
      });
      element.addEventListener("touchend", handleLongPressEnd, {
        passive: true,
      });

      return () => {
        element.removeEventListener("mousedown", handleLongPress);
        element.removeEventListener("mouseup", handleLongPressEnd);
        element.removeEventListener("touchstart", handleLongPress);
        element.removeEventListener("touchend", handleLongPressEnd);
      };
    }
  }, [ref, handleLongPress, handleLongPressEnd]);
}
