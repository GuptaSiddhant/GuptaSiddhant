import { useNavigate } from "@remix-run/react";

import { isExternalLink } from "@gs/helpers";
import useStableCallback from "@gs/hooks/useStableCallback";
import type { NavigationLinkProps } from "@gs/navigation/types";

const inputTagNames = ["input", "textarea", "select"];

export enum ShortcutModifier {
  SHIFT = "Shift",
  META = "Meta",
  ALT = "Alt",
  CONTROL = "Ctrl",
}

export enum KeyboardKey {
  BACKSPACE = "Backspace",
  SPACE = " ",
  ARROW_DOWN = "ArrowDown",
  ARROW_RIGHT = "ArrowRight",
  ARROW_LEFT = "ArrowLeft",
  ARROW_UP = "ArrowUp",
}

export default function useShortcutsCallback(
  shortcuts: Partial<NavigationLinkProps>[] = [],
) {
  const navigate = useNavigate();

  return useStableCallback((event: KeyboardEvent) => {
    const activeElement = window.document.activeElement as HTMLElement | null;
    // Do not react to keydown events if an input field is focussed
    if (
      activeElement &&
      inputTagNames.includes(activeElement.tagName.toLowerCase())
    ) {
      return;
    }

    const keyDownArray = generateKeyDownArray(event);

    shortcuts.forEach(({ shortcut, to, onClick }) => {
      if (matchKeyDownArrays(shortcut, keyDownArray)) {
        event.preventDefault();
        event.stopPropagation();
        onClick?.(
          event as unknown as React.MouseEvent<HTMLElement, MouseEvent>,
        );
        if (to) {
          const external = isExternalLink(to.toString());
          if (external) {
            window.open(to.toString(), "__blank");
          } else {
            navigate(to);
          }
        }
      }
    });
  });
}

export function generateKeyDownArray({
  key,
  shiftKey,
  metaKey,
  ctrlKey,
  altKey,
}: KeyboardEvent): Array<string> {
  const keys: string[] = [];

  if (key) {
    keys.push(key.toUpperCase());
  }
  if (shiftKey) {
    keys.push(ShortcutModifier.SHIFT);
  }
  if (metaKey) {
    keys.push(ShortcutModifier.META);
  }
  if (altKey) {
    keys.push(ShortcutModifier.ALT);
  }
  if (ctrlKey) {
    keys.push(ShortcutModifier.CONTROL);
  }

  return keys.sort();
}

export function matchKeyDownArrays(
  a: string[] = [],
  b: string[] = [],
): boolean {
  if (a.length !== b.length) {
    return false;
  }
  if (a.length === 0 || b.length === 0) {
    return false;
  }

  const normalisedA = a.map((k) => k.toUpperCase()).sort();
  const normalisedB = b.map((k) => k.toUpperCase()).sort();

  for (let i = 0; i < normalisedA.length; i++) {
    if (normalisedA[i] !== normalisedB[i]) {
      return false;
    }
  }

  return true;
}
