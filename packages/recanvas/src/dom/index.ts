import type { FiberRoot } from "react-reconciler"

import { ElementName } from "./constants"
import { createNode } from "./helpers"
import reconciler from "./reconciler"
import type { DOMElement } from "./types"

export default class RenderDOM {
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

  render(node: React.ReactNode, callback?: () => void): void {
    reconciler.updateContainer(node, this.#container, null, callback)
  }
}
