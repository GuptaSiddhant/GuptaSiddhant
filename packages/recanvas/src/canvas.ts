import { type Canvas, createCanvas } from "canvas"

const DEFAULT_CANVAS_SIZE = 512

export interface RecanvasContext {
  width: number
  height: number
}

export default class Recanvas {
  #canvas: Canvas
  #ctx: CanvasRenderingContext2D
  #context: RecanvasContext

  constructor(width = DEFAULT_CANVAS_SIZE, height = width, bg?: string) {
    this.#canvas = createCanvas(width, height)
    this.#ctx = this.#canvas.getContext("2d")
    this.#context = { width, height }
    if (bg) this.setBackground(bg)
  }

  get context() {
    return this.#context
  }

  buffer = (): Buffer => {
    return this.#canvas.toBuffer()
  }

  setBackground = (color: string): Recanvas => {
    return this.addRectangle({
      width: this.#canvas.width,
      height: this.#canvas.height,
      color,
    })
  }

  clear = () => {
    this.#ctx.clearRect(0, 0, this.#context.width, this.#context.height)
  }

  createView = (style: any) => {
    return this
  }

  addRectangle = (style: any): Recanvas => {
    const { lineWidth, shadowBlur, shadowColor, corner, color, variant } = style
    if (lineWidth) this.#ctx.lineWidth = lineWidth
    if (shadowBlur) this.#ctx.shadowBlur = shadowBlur
    if (shadowColor) this.#ctx.shadowColor = shadowColor
    if (corner) this.#ctx.lineJoin = corner
    if (color) {
      if (variant === "stroke") this.#ctx.strokeStyle = color
      else this.#ctx.fillStyle = color
    }

    const { x = 0, y = x, width = 0, height = width } = style
    this.#ctx.fillRect(x, y, width, height)

    return this
  }
}
