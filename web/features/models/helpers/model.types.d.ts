export interface ModelStyling {
  text: string
  border: string
  bg: string
  borderHocus?: string
  icon?: React.ReactNode
}

export type Model<T extends string = string> = ModelObjectType<T>
export type ModelProperties<T extends any> = Record<string, ModelProperty<T>>

export type ModelProperty<T extends any> = {
  required?: boolean
  size?: "small" | "medium" | "large"
} & (ModelScalerType | ModelObjectType<T> | ModelArrayType<T>)

export type ModelObjectType<T extends any> = {
  type: "object"
  properties: ModelProperties<T>
}
export type ModelArrayType<T extends any> = {
  type: "array"
  items: ModelProperty<T>
}

export type ModelScalerType =
  | {
      type: "boolean"
      default?: boolean
    }
  | {
      type: "string"
      enum?: string[]
      format?: "markdown" | "code"
    }
  | {
      type: "number"
    }

// export type ModelArrayType<T extends any> =
