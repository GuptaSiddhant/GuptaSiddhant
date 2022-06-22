const plugin = require("tailwindcss/plugin")
const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Nunito", "sans-serif"],
      serif: ["monospace", "serif"],
      monospace: ["Fira Code", "Menlo", "monospace"],
    },
    zIndex: {
      hide: -1,
      auto: "auto",
      0: 0,
      layout: 20,
      popover: 30,
      toast: 40,
      tooltip: 50,
    },
    colors: {
      black: "#000000",
      white: "#ffffff",
      transparent: "transparent",
      current: "currentColor",
      blue: colors.sky,
      red: colors.rose,
      green: colors.emerald,
      gray: colors.slate,
      purple: colors.purple,
      neutral: colors.neutral,
      orange: colors.amber,
      cyan: colors.cyan,
    },
    extend: {
      textColor: ({ theme }) => ({
        default: theme("colors.gray.100"),
        primary: theme("colors.white"),
        secondary: theme("colors.gray.200"),
        tertiary: theme("colors.gray.300"),
        disabled: theme("colors.gray.400"),
        inverse: theme("colors.gray.800"),
        link: theme("colors.blue.400"),
        "link-hover": theme("colors.blue.300"),
        success: theme("colors.green.400"),
        positive: theme("colors.green.400"),
        error: theme("colors.red.400"),
        danger: theme("colors.red.300"),
      }),
      backgroundColor: ({ theme }) => ({
        default: theme("colors.black"),
        primary: theme("colors.gray.900"),
        secondary: theme("colors.gray.800"),
        tertiary: theme("colors.gray.700"),
        disabled: theme("colors.gray.600 / 50%"),
        inverse: theme("colors.gray.200"),
        progress: theme("colors.blue.400"),
      }),
      borderColor: ({ theme }) => ({
        highlight: "highlight",
        divider: theme("colors.gray.600"),
      }),

      screens: {
        xs: "400px",
        "2xl": "1700px",
        "3xl": "2200px",
      },
      animation: {
        "appear-btt": "appear-btt 0.2s linear",
        "appear-rtl": "appear-rtl 0.2s ease-out",
        "disappear-ltr": "disappear-ltr 0.2s ease-in",
      },
      keyframes: {
        "appear-btt": {
          "0%": { transform: "translateY(50%)", opacity: 0.5 },
        },
        "appear-rtl": {
          "0%": { transform: "translateX(10%)", opacity: 0.5 },
        },
        "disappear-ltr": {
          "100%": { transform: "translateX(100%)", opacity: 0 },
        },
      },
      minHeight: {
        input: "2.5rem",
      },
      maxHeight: {
        "screen-main": "calc(100vh - 100px)",
      },
      width: {
        "full-m4": "calc(100% + 2rem)",
        "-full-m4": "calc(100% - 2rem)",
        "full-m8": "calc(100% + 4rem)",
        "-full-m8": "calc(100% - 4rem)",
      },
      fontFamily: {
        inherit: "inherit",
      },
      gridTemplateColumns: {
        markdown: "200px auto 200px",
      },
      scrollMargin: {
        "header-height": `var(--header-height)`,
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    plugin(({ addVariant, addUtilities, addBase }) => {
      addVariant("hocus", ["&:hover", "&:focus"])
      addVariant("hocus-within", ["&:hover", "&:focus-within"])
      addVariant("group-hocus", [".group:hover &", ".group:focus &"])
      addVariant("group-selected", [".group.selected &"])
      addVariant("peer-hocus", [".peer:hover &", ".peer:focus &"])
      addVariant("selected", ["&.selected"])

      addUtilities({
        ".flex-center": {
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
        },
        ".h-screen-webkit": {
          height: "-webkit-fill-available",
        },
      })
    }),
  ],
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
