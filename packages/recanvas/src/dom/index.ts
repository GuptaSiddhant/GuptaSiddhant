/**
 * License: MIT © vdemedes <vdemedes@gmail.com>
 * @see https://github.dev/vadimdemedes/ink/
 */

import { ElementName } from "./constants"
import { createNode } from "./helpers"
import reconciler from "./reconciler"
import type { Styles } from "./style"
import type { RecanvasFont } from "./text"

export default function renderDom(
  element: React.ReactNode,
  style: Styles & { width: number; height: number },
  font?: RecanvasFont,
  callback?: () => void,
) {
  const root = createNode(ElementName.Root, { style, font })

  const container = reconciler.createContainer(
    root,
    0,
    null,
    false,
    false,
    "",
    () => {},
    null,
  )

  reconciler.updateContainer(element, container, null, callback)

  return root
}

export * from "./types"
