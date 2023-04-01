import type { Config } from "tailwindcss";
import {
  amber,
  cyan,
  emerald,
  neutral,
  purple,
  rose,
  sky,
} from "tailwindcss/colors";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Nunito", "Helvetica", "sans-serif"],
      serif: ["serif"],
      monospace: ["Fira Code", "Menlo", "monospace"],
    },
    zIndex: {
      hide: "-1",
      auto: "auto",
      "0": "0",
      layout: "20",
      popover: "30",
      toast: "40",
      tooltip: "50",
    },
    colors: {
      black: "#000000",
      white: "#ffffff",
      transparent: "transparent",
      current: "currentColor",
      blue: sky,
      red: rose,
      green: emerald,
      gray: neutral,
      purple: purple,
      orange: amber,
      cyan: cyan,
    },
    extend: {
      colors: {
        DEFAULT: createColorTextCssVar("default"),
        default: createColorTextCssVar("default"),
        primary: createColorTextCssVar("primary"),
        secondary: createColorTextCssVar("secondary"),
        tertiary: createColorTextCssVar("tertiary"),
        disabled: createColorTextCssVar("disabled"),
        inverse: createColorTextCssVar("inverse"),
        link: createColorTextCssVar("link"),
        "link-hover": createColorTextCssVar("link"),
        positive: createColorTextCssVar("positive"),
        negative: createColorTextCssVar("negative"),
      },
      backgroundColor: {
        DEFAULT: createColorBgCssVar("default"),
        default: createColorBgCssVar("default"),
        primary: createColorBgCssVar("primary"),
        secondary: createColorBgCssVar("secondary"),
        tertiary: createColorBgCssVar("tertiary"),
        disabled: createColorBgCssVar("disabled"),
        inverse: createColorBgCssVar("inverse"),
        progress: createColorBgCssVar("progress"),
        positive: createColorBgCssVar("positive"),
        negative: createColorBgCssVar("negative"),
        float: createColorBgCssVar("float"),
      },
      borderColor: {
        DEFAULT: "var(--color-border-divider)",
        divider: "var(--color-border-divider)",
        highlight: "highlight",
      },
      fill: ({ theme }) => ({
        bg: theme("backgroundColor.default"),
        text: theme("textColor.default"),
      }),
      dropShadow: {
        icon: "0 2px 4px rgba(0, 0, 0, 0.5)",
      },
      screens: {
        "small-only": { max: "640px" },
        xs: "400px",
        "2xl": "1700px",
        "3xl": "2200px",
      },
      animation: {
        appear: "appear 0.2s ease-in",
        "appear-btt": "appear-btt 0.2s linear",
        "appear-rtl": "appear-rtl 0.2s ease-out",
        "disappear-ltr": "disappear-ltr 0.2s ease-in",
      },
      keyframes: {
        appear: {
          "0%": { opacity: "0.5" },
        },
        "appear-btt": {
          "0%": { transform: "translateY(50%)", opacity: "0.5" },
        },
        "appear-rtl": {
          "0%": { transform: "translateX(10%)", opacity: "0.5" },
        },
        "disappear-ltr": {
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
      },
      minHeight: {
        input: "2rem",
        "screen-main": "calc(100vh - 10em)",
      },
      maxHeight: {
        "screen-main": "calc(100vh - 100px)",
      },
      height: {
        available: "-webkit-fill-available",
      },
      maxWidth: {
        xxs: "15rem",
      },
      width: {
        "full-m4": "calc(100% + 2rem)",
        "-full-m4": "calc(100% - 2rem)",
        "full-m8": "calc(100% + 4rem)",
        "-full-m8": "calc(100% - 4rem)",
        "screen-m4": "calc(100vw + 2rem)",
        "-screen-m4": "calc(100vw - 2rem)",
        "screen-m8": "calc(100vw + 4rem)",
        "-screen-m8": "calc(100vw - 4rem)",
      },
      fontFamily: {
        inherit: "inherit",
      },
      gridTemplateColumns: {
        markdown: "200px auto 200px",
      },
      scrollMargin: {
        "header-height": "var(--header-height)",
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    plugin(({ addVariant, addUtilities }) => {
      addVariant("hocus", ["&:hover", "&:focus"]);
      addVariant("hocus-within", ["&:hover", "&:focus-within"]);
      addVariant("group-hocus", [".group:hover &", ".group:focus &"]);
      addVariant("group-selected", [".group.selected &"]);
      addVariant("peer-hocus", [".peer:hover &", ".peer:focus &"]);
      addVariant("selected", ["&.selected"]);

      addUtilities({
        ".flex-center": {
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
        },
        ".h-screen-webkit": {
          height: "-webkit-fill-available",
        },
      });
    }),
  ],
} satisfies Config;

function createColorTextCssVar(name: string) {
  return createCssVarValue("color", "text", name);
}
function createColorBgCssVar(name: string) {
  return createCssVarValue("color", "bg", name);
}

function createCssVarValue(type: string, subType?: string, name?: string) {
  return `var(--${[type, subType, name].filter(Boolean).join("-")})`;
}

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
