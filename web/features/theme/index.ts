import darkThemeColors from "./theme-dark"
import lightThemeColors from "./theme-light"
import { generateCSSValue } from "./utils"

export type ThemeName = "dark" | "light"

export const DEFAULT_THEME: ThemeName = "dark"

export default function getCSSForThemeName(themeName?: ThemeName) {
  return generateCSSValue(getThemeFromThemeName(themeName))
}

export function getThemeFromThemeName(themeName?: ThemeName) {
  switch (themeName) {
    case "light":
      return lightThemeColors
    case "dark":
    default:
      return darkThemeColors
  }
}

export function checkIfDarkTheme(name?: ThemeName) {
  return name !== "light"
}

export type { ThemeColors } from "./utils"
