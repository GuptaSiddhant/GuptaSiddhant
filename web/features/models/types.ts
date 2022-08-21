export type ModelsMap = Record<string, Model>

export enum ModelSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  FULL = "full",
}

export type Model = {
  required?: boolean
  size?: ModelSize
} & (ModelScalerType | ModelObjectType | ModelArrayType)

export type ModelObjectType = {
  type: "object"
  properties: ModelsMap
}

export type ModelArrayType = {
  type: "array"
  items: Model
}

export type ModelScalerType =
  | ModelBooleanType
  | ModelStringType
  | ModelNumberType

export type ModelStringType = {
  type: "string"
  enum?: string[]
  format?: "markdown" | "code"
}

export type ModelBooleanType = {
  type: "boolean"
  default?: boolean
}

export type ModelNumberType = {
  type: "number"
}

export interface ModelStyling {
  text: string
  border: string
  bg: string
  borderHocus?: string
  icon?: React.ReactNode
}
