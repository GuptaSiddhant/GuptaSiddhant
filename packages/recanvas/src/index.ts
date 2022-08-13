import Recanvas from "./canvas"
import RenderDOM from "./dom"

export function renderCanvas(
  element: React.ReactNode,
  width: number,
  height = width,
  callback?: () => void,
) {
  const canvas = new Recanvas(width, height, "blue")

  new RenderDOM().render(element, callback)

  return canvas.buffer()
}
