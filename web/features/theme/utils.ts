import colors from "tailwindcss/colors"

export const {
  neutral: gray,
  white,
  black,
  sky: blue,
  emerald: green,
  rose: red,
} = colors

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
  | "progress"
  | "negative"
  | "positive"
  | "float",
  string
>

type BorderColors = Record<"divider", string>
