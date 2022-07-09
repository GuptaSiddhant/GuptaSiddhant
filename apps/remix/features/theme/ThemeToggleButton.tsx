import DarkModeIcon from "remixicon-react/MoonFillIcon"
import LightModeIcon from "remixicon-react/MoonLineIcon"

import FormAction from "~/features/ui/FormAction"

import { type ThemeName } from "."

export default function ThemeToggleButton({
  themeName,
}: {
  themeName: ThemeName
}) {
  return (
    <FormAction
      action="/theme.css"
      method="post"
      reloadDocument
      title="Toggle dark mode"
      body={{ theme: themeName === "light" ? "dark" : "light" }}
    >
      {themeName === "light" ? <LightModeIcon /> : <DarkModeIcon />}
    </FormAction>
  )
}
