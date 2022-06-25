import { black, slate as tailwind, white } from "tailwindcss/colors"

import type { Style } from "./types"

export const colors = {
  // palette
  ...tailwind,
  white,
  black,
  // text
  textPrimary: tailwind[900],
  textSecondary: tailwind[700],
  textDisabled: tailwind[500],
  // bg
  bgBase: white,
  bgFloat: tailwind[100],
  bgInput: tailwind[200],
  // border
  border: tailwind[200],
}

// Texts

const fonts = {
  mono: "Courier",
  monoBold: "Courier-Bold",
  sans: "Helvetica",
  sansBold: "Helvetica-Bold",
  serif: "Times",
  serifBold: "Times-Bold",
}

type TextType = `h1` | `h2` | `h3` | `h4` | `h5` | `h6` | `p` | "mono" | "small"

export const texts: Record<TextType, Style> = {
  h1: {
    fontFamily: fonts.monoBold,
    fontSize: 24,
  },
  h2: {
    fontFamily: fonts.monoBold,
    fontSize: 20,
  },
  h3: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
  },
  h4: {
    fontFamily: fonts.mono,
    fontSize: 16,
  },
  h5: {
    fontFamily: fonts.mono,
    fontSize: 14,
  },
  h6: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
  },
  mono: { fontFamily: fonts.mono, fontSize: 12 },
  p: {
    fontFamily: fonts.sans,
    fontSize: 12,
  },
  small: {
    fontFamily: fonts.mono,
    fontSize: 10,
  },
}
