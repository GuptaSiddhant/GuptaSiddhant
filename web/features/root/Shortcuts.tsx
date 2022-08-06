import { useNavigate } from "@remix-run/react"

import { isExternalLink } from "@gs/helpers"
import useEventListener from "@gs/hooks/useEventListener"
import useNavigationLinks from "@gs/navigation/useNavigationLinks"
import useSearch from "@gs/search"

const inputTagNames = ["input", "textarea", "select"]

export default function Shortcuts(): JSX.Element | null {
  useShortcuts()

  return null
}

function useShortcuts() {
  const { openSearch, isSearchOpen } = useSearch()
  const links = useNavigationLinks()
  const navigate = useNavigate()

  return useEventListener("keydown", (event) => {
    if (event.metaKey) {
      if (event.key === "k" || event.key === "K") {
        event.preventDefault()
        event.stopPropagation()
        !isSearchOpen && openSearch()
        return
      }
    }

    const activeElement = window.document.activeElement as HTMLElement | null
    // Do not react to keydown events if an input field is focussed,
    // unless it is the search input field.
    if (
      activeElement &&
      inputTagNames.includes(activeElement.tagName.toLowerCase())
    ) {
      return
    }

    links.forEach(({ shortcut, id, to }) => {
      if (to && shortcut) {
        const shortcutLowercase = shortcut.map((key) => key.toLowerCase())
        const needShift = shortcutLowercase.includes("shift")
        const needCtrl = shortcutLowercase.includes("ctrl")
        const needMeta = shortcutLowercase.includes("meta")
        const needAlt = shortcutLowercase.includes("alt")
        const key =
          shortcutLowercase.filter(
            (key) => !["shift", "ctrl", "meta", "alt"].includes(key),
          )[0] || ""

        if (needShift && !event.shiftKey) return
        if (needCtrl && !event.ctrlKey) return
        if (needMeta && !event.metaKey) return
        if (needAlt && !event.altKey) return

        if (event.key === key || event.key === key.toUpperCase()) {
          const external = isExternalLink(to.toString())
          if (!external) navigate(to)
          else window.open(to.toString(), "__blank")
        }
      }
    })
  })
}
