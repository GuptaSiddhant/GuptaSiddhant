import { useEffect, useRef } from "react";

export default function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  disabled?: boolean,
) {
  const elRef = useRef<T>(null);

  function handleFocus(e: KeyboardEvent) {
    const element = elRef.current;
    if (!element) {
      return;
    }

    const focusableEls = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], input[type="file"], input[type="search"], select',
    );
    const firstFocusableEl = focusableEls[0] as HTMLElement;
    const lastFocusableEl = focusableEls[
      focusableEls.length - 1
    ] as HTMLElement;

    const isTabPressed = e.key === "Tab";

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableEl) {
        e.preventDefault();
        e.stopPropagation();
        return lastFocusableEl.focus();
      }
      return;
    }

    if (document.activeElement === lastFocusableEl) {
      e.preventDefault();
      return firstFocusableEl.focus();
    }
  }

  useEffect(() => {
    const element = elRef.current;
    if (!element || disabled) {
      return;
    }

    element?.addEventListener("keydown", handleFocus);

    return () => element?.removeEventListener("keydown", handleFocus);
  }, [disabled]);

  return elRef;
}
