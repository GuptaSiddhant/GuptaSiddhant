// import { createElement } from "react"
import type { FiberRoot } from "react-reconciler"

// import Canvas from "./components/Canvas"
import { ElementName } from "./constants"
import { createNode } from "./dom"
import reconciler from "./reconciler"
import type { DOMElement } from "./types"

export default class Recanvas {
  readonly #container: FiberRoot
  readonly #rootNode: DOMElement

  constructor() {
    this.#rootNode = createNode(ElementName.Root)
    this.#container = reconciler.createContainer(
      this.#rootNode,
      0,
      null,
      false,
      false,
      "",
      () => {},
      null,
    )
  }

  render(node: React.ReactNode): void {
    // const tree = createElement(Canvas, {}, node)

    reconciler.updateContainer(node, this.#container, null)
  }
}
