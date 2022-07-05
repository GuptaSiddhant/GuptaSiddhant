import { type ThemeColors, black, blue, gray, green, red } from "./utils"

const lightThemeColors: ThemeColors = {
  text: {
    default: gray[900],
    primary: black,
    secondary: gray[800],
    tertiary: gray[700],
    disabled: gray[600],
    inverse: gray[200],
    link: blue[600],
    "link-hover": blue[700],
    positive: green[600],
    negative: red[600],
  },
  bg: {
    default: gray[200],
    primary: gray[50],
    secondary: gray[100],
    tertiary: gray[300],
    disabled: gray[400],
    inverse: gray[800],
    progress: blue[600],
    negative: red[500],
    positive: green[500],
  },
  border: {
    divider: gray[200],
  },
}

export default lightThemeColors
