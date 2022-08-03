import { black, rose, sky, slate, white } from "tailwindcss/colors"

import type { Style } from "./types"

const fonts = {
  mono: "Courier",
  monoBold: "Courier-Bold",
  sans: "Helvetica",
  sansBold: "Helvetica-Bold",
  serif: "Times-Roman",
  serifBold: "Times-Bold",
}

// Functions

export function generateColors(color?: string) {
  const palette = color === "red" ? rose : color === "blue" ? sky : slate

  return {
    white,
    black,
    // text
    textPrimary: palette[900],
    textSecondary: palette[700],
    textDisabled: palette[500],
    // bg
    bgBase: white,
    bgFloat: palette[50],
    // border
    border: palette[200],
  } as const
}

export type ResumeColors = ReturnType<typeof generateColors>

// Texts

type TextType = `h1` | `h2` | `h3` | `h4` | `h5` | `h6` | `p` | "mono" | "small"

export type ResumeTexts = Record<TextType, Style>

export type FontType = "mono" | "sans" | "serif"

export function generateTexts(font: FontType): ResumeTexts {
  const fontRegular =
    font === "serif" ? fonts.serif : font === "sans" ? fonts.sans : fonts.mono
  const fontBold =
    font === "serif"
      ? fonts.serifBold
      : font === "sans"
      ? fonts.sansBold
      : fonts.monoBold

  const texts: ResumeTexts = {
    h1: {
      fontFamily: fontBold,
      fontSize: 24,
    },
    h2: {
      fontFamily: fontBold,
      fontSize: 20,
    },
    h3: {
      fontFamily: fontBold,
      fontSize: 18,
    },
    h4: {
      fontFamily: fontRegular,
      fontSize: 16,
    },
    h5: {
      fontFamily: fontRegular,
      fontSize: 14,
    },
    h6: {
      fontFamily: fontBold,
      fontSize: 12,
    },
    p: {
      fontFamily: fontRegular,
      fontSize: 12,
    },
    small: {
      fontFamily: fontRegular,
      fontSize: 10,
    },
    mono: { fontFamily: fonts.mono, fontSize: 12 },
  }

  return texts
}
