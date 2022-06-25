import { black, slate as tailwind, white } from "tailwindcss/colors"

import type { Style } from "./types"

export const colors = {
  ...tailwind,
  white,
  black,

  textPrimary: tailwind[900],
  textSecondary: tailwind[700],
  textDisabled: tailwind[500],

  bgBase: white,
  bgFloat: tailwind[50],
  bgInput: tailwind[200],

  border: tailwind[200],
}

type TextType = `h1` | `h2` | `h3` | `h4` | `h5` | `h6` | `p` | "mono" | "small"

export const texts: Record<TextType, Style> = {
  h1: {
    fontFamily: "Courier-Bold",
    fontSize: 24,
  },
  h2: {
    fontFamily: "Courier-Bold",
    fontSize: 20,
  },
  h3: {
    fontFamily: "Courier-Bold",
    fontSize: 18,
  },
  h4: {
    fontFamily: "Courier",
    fontSize: 16,
  },
  h5: {
    fontFamily: "Courier",
    fontSize: 14,
  },
  h6: {
    fontFamily: "Courier-Bold",
    fontSize: 12,
  },
  mono: { fontFamily: "Courier", fontSize: 12 },
  p: {
    fontFamily: "Courier",
    fontSize: 12,
  },
  small: {
    fontFamily: "Courier",
    fontSize: 10,
  },
}
