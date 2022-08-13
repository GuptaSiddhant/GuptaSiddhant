// import { StyleProps } from "./constants"

import { createCanvas } from "canvas"

import { ElementName, TEXT_NAME } from "./constants"
import type { DOMElement, DOMNode } from "./types"

export interface RecanvasFont {
  size?: number
  family?: ImagerFontFamily
  weight?: ImagerFontWeight
  style?: ImagerFontStyle
  variant?: ImagerFontVariant
  lineHeight?: number
}

export enum ImagerFontFamily {
  Monospace = "monospace",
  Serif = "serif",
  SansSerif = "sans-serif",
  // Named
  Arial = "Arial",
  Verdana = "Verdana",
  Times = "Times New Roman",
  Georgia = "Georgia",
  BrushScript = "Brush Script MT",
  Courier = "Courier New",
}

export enum ImagerFontWeight {
  Normal = "normal",
  Bold = "bold",
  Bolder = "bolder",
  Lighter = "lighter",
}

export enum ImagerFontStyle {
  Normal = "normal",
  Italic = "italic",
  Oblique = "oblique",
}

export enum ImagerFontVariant {
  Normal = "normal",
  SmallCaps = "small-caps",
}

const DEFAULT_FONT: Required<RecanvasFont> = {
  size: 16,
  family: ImagerFontFamily.SansSerif,
  weight: ImagerFontWeight.Normal,
  style: ImagerFontStyle.Normal,
  variant: ImagerFontVariant.Normal,
  lineHeight: 1.5,
}

export function generateFontString(font: RecanvasFont = {}) {
  const {
    family = DEFAULT_FONT.family,
    size = DEFAULT_FONT.size,
    style = DEFAULT_FONT.style,
    variant = DEFAULT_FONT.variant,
    weight = DEFAULT_FONT.weight,
  } = font

  return `${style} ${variant} ${weight} ${size}px "${family}"`
}

export function squashTextNodes(element: DOMElement): string {
  let text = ""

  if (element.childNodes.length > 0) {
    for (const childNode of element.childNodes) {
      let nodeText = ""

      if (childNode.nodeName === TEXT_NAME) {
        nodeText = childNode.nodeValue
      } else {
        if (
          childNode.nodeName === ElementName.Text ||
          childNode.nodeName === ElementName.VirtualText
        ) {
          nodeText = squashTextNodes(childNode)
        }

        // Since these text nodes are being concatenated, `Output` instance won't be able to
        // apply children transform, so we have to do it manually here for each text node
        if (
          nodeText.length > 0 &&
          typeof childNode.internal_transform === "function"
        ) {
          nodeText = childNode.internal_transform(nodeText)
        }
      }

      text += nodeText
    }
  }

  return text
}

export function wrapText(
  text: string,
  maxWidth: number,
  font?: RecanvasFont,
  truncate: boolean = false,
): { text: string; width: number; height: number } {
  const textMeasure = measureText(text, font)
  if (textMeasure.width < maxWidth) return { text, ...textMeasure }

  const lines = splitTextInLines(text, maxWidth, font)

  if (truncate) {
    const truncatedText = lines[0] + "..."
    return { text: truncatedText + "...", ...measureText(truncatedText, font) }
  }

  // Wrap

  const { width, height } = lines.reduce(
    (acc, line) => {
      const { width, height } = measureText(line, font)

      return {
        width: Math.max(width, acc.width),
        height: acc.height + height,
      }
    },
    { width: 0, height: 0 },
  )

  return { text: lines.join("\n"), width, height }
}

export interface TextMeasure {
  width: number
  height: number
}

export function measureText(text: string, font?: RecanvasFont): TextMeasure {
  if (text.length === 0) return { width: 0, height: 0 }

  const { lineHeight = DEFAULT_FONT.lineHeight } = font || {}
  const canvas = createCanvas(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
  const context = canvas.getContext("2d")
  context.font = generateFontString(font)
  const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } =
    context.measureText(text)

  return {
    width,
    height: (actualBoundingBoxAscent + actualBoundingBoxDescent) * lineHeight,
  }
}

function splitTextInLines(text: string, maxWidth: number, font?: RecanvasFont) {
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""

  for (const word of words) {
    const width = measureText(currentLine + word, font).width
    if (width < maxWidth) {
      currentLine += word + " "
    } else {
      lines.push(currentLine)
      currentLine = word + " "
    }
  }
  lines.push(currentLine)

  return lines
}

export function measureTextNode(
  node: DOMNode,
  font: RecanvasFont | undefined,
  maxWidth: number,
): TextMeasure {
  const text =
    node.nodeName === TEXT_NAME ? node.nodeValue : squashTextNodes(node)

  const dimensions = measureText(text, font)

  // Text fits into container, no need to wrap
  if (dimensions.width <= maxWidth) {
    return dimensions
  }

  // This is happening when <Box> is shrinking child nodes and Yoga asks
  // if we can fit this text node in a <1px space, so we just tell Yoga "no"
  if (dimensions.width >= 1 && maxWidth > 0 && maxWidth < 1) {
    return dimensions
  }

  const truncate = node.style.truncate
  const { height, width } = wrapText(text, maxWidth, font, truncate)

  return { height, width }
}
