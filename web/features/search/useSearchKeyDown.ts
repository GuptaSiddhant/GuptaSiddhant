import useEventListener from "../hooks/useEventListener"
import useSearch from "."

const inputTagNames = ["input", "textarea", "select"]
const alphabets = "abcdefghijklmnopqrstuvwxyz".split("")
const numbers = "0123456789".split("")

export default function useSearchKeyDown(
  inputRef: React.RefObject<HTMLInputElement>,
  resultsRef: React.RefObject<HTMLDivElement>,
): void {
  const { toggleSearchOpen } = useSearch()

  useEventListener("keydown", (event) => {
    if (event.metaKey) {
      if (event.key === "k" || event.key === "K") {
        event.preventDefault()
        toggleSearchOpen()
      }
      return
    }

    const activeElement = window.document.activeElement as HTMLElement | null

    // Do not react to keydown events if an input field is focussed,
    // unless it is the search input field.
    if (
      activeElement &&
      inputTagNames.includes(activeElement.tagName.toLowerCase()) &&
      activeElement.id !== inputRef.current?.id
    ) {
      return
    }

    // If an alphanumeric key, space or backspace is pressed, focus the search input field.
    if (
      event.key === "Backspace" ||
      event.key === " " ||
      alphabets.includes(event.key.toLowerCase()) ||
      numbers.includes(event.key)
    ) {
      return inputRef.current?.focus()
    }

    // Results

    const results = resultsRef.current?.querySelectorAll("a[href]")
    if (!results) return

    const { activeIndex, focusElementAtIndex } = getResultHelpers(
      results,
      activeElement,
    )

    // If down arrow is pressed, focus the next result.
    if (event.key === "ArrowDown") {
      event.preventDefault()

      if (activeIndex === results.length - 1) {
        return focusElementAtIndex(0)
      }
      return focusElementAtIndex(activeIndex + 1)
    }

    // If up arrow is pressed, focus the next result.
    if (event.key === "ArrowUp") {
      event.preventDefault()

      if (activeIndex <= 0) {
        return focusElementAtIndex(results.length - 1)
      }
      return focusElementAtIndex(activeIndex - 1)
    }
  })
}

function getResultHelpers(
  results: NodeListOf<Element>,
  activeElement: HTMLElement | null,
) {
  return {
    activeIndex: [...results].findIndex((result) => result === activeElement),
    focusElementAtIndex: (index: number) =>
      (results.item(index) as HTMLElement).focus(),
  }
}
