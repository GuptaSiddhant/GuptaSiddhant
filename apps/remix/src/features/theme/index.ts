import darkThemeColors from "./theme-dark";
import lightThemeColors from "./theme-light";
import { generateCSSValue } from "./utils";

export enum ThemeName {
  Dark = "dark",
  Light = "light",
}

export const DEFAULT_THEME = ThemeName.Dark;

export default function getCSSForThemeName(themeName?: ThemeName) {
  return generateCSSValue(getThemeFromThemeName(themeName));
}

export function getThemeFromThemeName(themeName?: ThemeName) {
  switch (themeName) {
    case ThemeName.Light:
      return lightThemeColors;
    case ThemeName.Dark:
    default:
      return darkThemeColors;
  }
}

export function checkIfDarkTheme(name?: ThemeName) {
  return name !== ThemeName.Light;
}

export type { ThemeColors } from "./utils";
