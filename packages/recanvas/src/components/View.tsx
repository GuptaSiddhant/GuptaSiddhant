import { createElement } from "react"

import { ElementName } from "../constants"
import type { ElementProps } from "../types"

export interface ViewProps extends ElementProps {}

export default function View({ children, ...props }: ViewProps) {
  return createElement(ElementName.View, props, children)
}
