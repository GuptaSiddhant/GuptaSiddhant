import { useNavigate } from "@remix-run/react"

import { isExternalLink } from "@gs/helpers"
import useEventListener from "@gs/hooks/useEventListener"
import type { NavigationLinkProps } from "@gs/navigation/types"
import useNavigationLinks from "@gs/navigation/useNavigationLinks"
import { useToggleTheme } from "@gs/theme/ThemeToggleButton"

const inputTagNames = ["input", "textarea", "select"]

export default function Shortcuts(): JSX.Element | null {
  useShortcuts()

  return null
}

function useShortcuts() {
  const navigate = useNavigate()
  const links = useNavigationLinks()
  const shortcuts: Partial<NavigationLinkProps>[] = [
    ...links,
    {
      id: "search",
      onClick: useToggleTheme(),
      shortcut: ["Shift", "D"],
    },
    {
      id: "Admin",
      onClick: () => navigate("/admin"),
      shortcut: ["Shift", "Q"],
    },
  ]

  return useEventListener("keydown", (event) => {
    const activeElement = window.document.activeElement as HTMLElement | null
    // Do not react to keydown events if an input field is focussed
    if (
      activeElement &&
      inputTagNames.includes(activeElement.tagName.toLowerCase())
    ) {
      return
    }

    shortcuts.forEach(({ shortcut, to, onClick }) => {
      if (shortcut) {
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
          event.preventDefault()
          event.stopPropagation()
          onClick?.(event as any)
          if (to) {
            const external = isExternalLink(to.toString())
            if (!external) navigate(to)
            else window.open(to.toString(), "__blank")
          }
        }
      }
    })
  })
}
