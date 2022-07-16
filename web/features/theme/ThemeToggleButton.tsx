import Action from "@gs/ui/Action"
import DarkModeIcon from "remixicon-react/MoonFillIcon"
import LightModeIcon from "remixicon-react/MoonLineIcon"

import { type ThemeName } from "."

export default function ThemeToggleButton({
  themeName,
}: {
  themeName: ThemeName
}) {
  return (
    <Action.Form
      action="/theme.css"
      method="post"
      title="Toggle dark mode"
      body={{ theme: themeName === "light" ? "dark" : "light" }}
      reloadDocument
    >
      {themeName === "light" ? <LightModeIcon /> : <DarkModeIcon />}
    </Action.Form>
  )
}