import { KeyboardKey } from "@gs/hooks/useShortcutsCallback";
import useStableCallback from "@gs/hooks/useStableCallback";

import useSearch from "./context";

const inputTagNames = ["input", "textarea", "select"];
const alphanumerics = "abcdefghijklmnopqrstuvwxyz0123456789".split("");

export default function useSearchKeyDown() {
  const { inputRef, resultsRef, closeSearch } = useSearch();

  return useStableCallback((event: React.KeyboardEvent<HTMLDialogElement>) => {
    const activeElement = window.document.activeElement as HTMLElement | null;

    if (event.metaKey && (event.key === "k" || event.key === "K")) {
      return closeSearch();
    }

    // Do not react to keydown events if an input field is focussed,
    // unless it is the search input field.
    if (
      activeElement &&
      inputTagNames.includes(activeElement.tagName.toLowerCase()) &&
      activeElement.id !== inputRef.current?.id
    ) {
      return;
    }

    // If an alphanumeric key, space or backspace is pressed, focus the search input field.
    if (
      [KeyboardKey.BACKSPACE, KeyboardKey.SPACE, ...alphanumerics]
        .map((k) => k.toLowerCase())
        .includes(event.key.toLowerCase())
    ) {
      return inputRef.current?.focus();
    }

    // Results

    const results = resultsRef.current?.querySelectorAll("a[href], button");
    if (!results) {
      return;
    }

    const { activeIndex, focusElementAtIndex } = getResultHelpers(
      results,
      activeElement,
    );

    // If down arrow is pressed, focus the next result.
    if (event.key === KeyboardKey.ARROW_DOWN) {
      event.preventDefault();

      if (activeIndex === results.length - 1) {
        return focusElementAtIndex(0);
      }
      return focusElementAtIndex(activeIndex + 1);
    }

    // If up arrow is pressed, focus the next result.
    if (event.key === KeyboardKey.ARROW_UP) {
      event.preventDefault();

      if (activeIndex <= 0) {
        return focusElementAtIndex(results.length - 1);
      }
      return focusElementAtIndex(activeIndex - 1);
    }
  });
}

function getResultHelpers(
  results: NodeListOf<Element>,
  activeElement: HTMLElement | null,
) {
  return {
    activeIndex: [...results].findIndex((result) => result === activeElement),
    focusElementAtIndex: (index: number) =>
      (results.item(index) as HTMLElement).focus(),
  };
}
