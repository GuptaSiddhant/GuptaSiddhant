import Recanvas from "./canvas"
import { ElementName } from "./constants"
import { createNode } from "./dom"
import reconciler from "./reconciler"

export function renderCanvas(
  element: React.ReactNode,
  width: number,
  height = width,
  callback?: () => void,
) {
  const canvas = new Recanvas(width, height)
  const node = createNode(ElementName.Root)

  const container = reconciler.createContainer(
    node,
    0,
    null,
    false,
    false,
    "",
    () => {},
    null,
  )

  reconciler.updateContainer(element, container, undefined, callback)

  return canvas.buffer()
}
