import useEventListener from "../hooks/useEventListener"
import useSearch from "."

const inputTagNames = ["input", "textarea", "select"]

export default function useSearchShortcuts() {
  const { toggleSearchOpen } = useSearch()

  useEventListener("keydown", (e) => {
    const { key, metaKey } = e

    if (metaKey && (key === "k" || key === "K")) {
      e.preventDefault()
      return toggleSearchOpen()
    }

    // Do not react to keydown events if an input field is focussed
    const activeElement = window.document.activeElement
    if (
      activeElement &&
      inputTagNames.includes(activeElement.tagName.toLowerCase())
    ) {
      return
    }

    // if (window.document.activeElement?.tagName === "INPUT") {

    // console.log({ key, metaKey, ctrlKey, shiftKey })
  })
}
