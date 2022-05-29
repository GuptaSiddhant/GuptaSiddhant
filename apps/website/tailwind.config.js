const colors = require("tailwindcss/colors")
const { gray, emerald, rose, sky, white, black } = colors

/**
 * @typedef {import("@types/tailwindcss/tailwind-config").TailwindThemeColors} TailwindThemeColors
 * @typedef {import("@types/tailwindcss/tailwind-config").TailwindColorGroup} TailwindColorGroup
 * @typedef {import("@types/tailwindcss/tailwind-config").TailwindConfig} TailwindConfig
 */

/** @type {TailwindThemeColors} */
const textColor = ({ theme }) => ({
  default: gray[100],
  primary: white,
  secondary: gray[200],
  tertiary: gray[300],
  quaternary: gray[400],
  disabled: gray[500],
  link: theme("colors.blue.400"),
  "link-hover": theme("colors.blue.300"),
  error: theme("colors.red.400"),
  danger: theme("colors.red.300"),
})

/** @type {TailwindThemeColors} */
const backgroundColor = ({ theme }) => ({
  default: black,
  primary: gray[900],
  secondary: gray[800],
  tertiary: gray[700],
  quaternary: gray[600],
  disabled: gray[500],
  progress: theme("colors.blue.400"),
})

/** @type {TailwindConfig} */
const config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Nunito", "sans-serif"],
      serif: ["monospace", "serif"],
      monospace: ["Fira Code", "Menlo", "monospace"],
    },

    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        blue: sky,
        red: rose,
        green: emerald,
      },
      textColor,
      backgroundColor,
      screens: {
        xs: "400px",
        "2xl": "1700px",
        "3xl": "2200px",
      },
      keyframes: {
        appear: {
          "0%": { transform: "translateY(50%)", opacity: "0" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        appear: "appear 0.2s linear",
      },
      maxHeight: {
        "screen-main": "calc(100vh - 100px)",
      },
      width: {
        "full-m4": "calc(100% + 2rem)",
      },
      borderColor: {
        highlight: "highlight",
      },
      fontFamily: {
        inherit: "inherit",
      },
      gridTemplateColumns: {
        markdown: "200px auto 200px",
      },
    },
  },

  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
}

module.exports = config

// /** @type {TailwindColorGroup} */
// const myGrayColors = {
//   50: "#EFF1F3",
//   100: "#DFE3E7",
//   200: "#C1C7D0",
//   300: "#A3ACBA",
//   400: "#8592A4",
//   500: "#69788F",
//   600: "#535F71",
//   700: "#3E4755",
//   800: "#2B313A",
//   900: "#181C21",
// }
