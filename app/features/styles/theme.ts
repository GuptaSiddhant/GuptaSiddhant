import colors from "tailwindcss/colors"

const {
  neutral: gray,
  white,
  black,
  sky: blue,
  emerald: green,
  rose: red,
} = colors

// Themes

const darkThemeColors: ThemeColors = {
  text: {
    default: gray[100],
    primary: white,
    secondary: gray[200],
    tertiary: gray[300],
    disabled: gray[400],
    inverse: gray[800],
    link: blue[400],
    "link-hover": blue[300],
    positive: green[400],
    negative: red[400],
  },
  bg: {
    default: black,
    primary: gray[900],
    secondary: gray[800],
    tertiary: gray[700],
    disabled: gray[600],
    inverse: gray[200],
    progress: blue[400],
  },
  border: {
    divider: gray[600],
  },
}

export default {
  dark: darkThemeColors,
}

// Helpers

export function generateCSSValue(theme: ThemeColors) {
  const { text, bg, border } = theme
  const textColors = Object.entries(text).map(
    ([name, value]) => `--color-text-${name}: ${value};`,
  )
  const bgColors = Object.entries(bg).map(
    ([name, value]) => `--color-bg-${name}: ${value};`,
  )
  const borderColors = Object.entries(border).map(
    ([name, value]) => `--color-border-${name}: ${value};`,
  )
  const varList = [...textColors, ...bgColors, ...borderColors].join("\n")

  return `:root {\n${varList}\n}`
}

export interface ThemeColors {
  text: TextColors
  bg: BgColors
  border: BorderColors
}

type TextColors = Record<
  | "default"
  | "primary"
  | "secondary"
  | "tertiary"
  | "disabled"
  | "inverse"
  | "link"
  | "link-hover"
  | "positive"
  | "negative",
  string
>

type BgColors = Record<
  | "default"
  | "primary"
  | "secondary"
  | "tertiary"
  | "disabled"
  | "inverse"
  | "progress",
  string
>

type BorderColors = Record<"divider", string>
