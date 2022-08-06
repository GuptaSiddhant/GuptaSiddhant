import { type ThemeColors, black, blue, gray, green, red, white } from "./utils"

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
    negative: red[600],
    positive: green[600],
    float: "#000c",
  },
  border: {
    divider: gray[600],
  },
}

export default darkThemeColors
