import { createElement } from "react"

import { ElementName } from "../constants"
import type { RecanvasFont } from "../text"
import type { ElementProps } from "../types"

export interface TextProps extends ElementProps {
  font?: RecanvasFont
}

export default function Text({ children, ...props }: TextProps) {
  return createElement(ElementName.Text, props, children)
}
