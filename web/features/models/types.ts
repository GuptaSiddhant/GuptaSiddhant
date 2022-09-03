export type ModelsMap = {
  [key: string]: Model
}

export enum ModelSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  FULL = "full",
}

export type Model = ModelScalerType | ModelObjectType | ModelArrayType

export type ModelObjectType = ModelCommon & {
  type: "object"
  properties: ModelsMap
}

export type ModelArrayType = ModelCommon & {
  type: "array"
  items: ModelScalerType | ModelObjectType
}

export type ModelScalerType =
  | ModelBooleanType
  | ModelStringType
  | ModelNumberType

export type ModelStringType = ModelCommon & {
  type: "string"
  enum?: string[]
  format?: "markdown" | "code" | "email" | "date"
}

export type ModelBooleanType = ModelCommon & {
  type: "boolean"
  default?: boolean
}

export type ModelNumberType = ModelCommon & {
  type: "number"
}

export interface ModelStyling {
  text: string
  border: string
  bg: string
  borderHocus?: string // hover and focus
  icon?: React.ReactNode
}

interface ModelCommon {
  required?: boolean
  size?: ModelSize
}
