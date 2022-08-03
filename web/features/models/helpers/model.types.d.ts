export interface ModelStyling {
  text: string
  border: string
  bg: string
  borderHocus?: string
  icon?: React.ReactNode
}

export type Model<T extends string = string> = ModelObjectType<T>

export type ModelProperty<T extends any> =
  | ModelScalerType
  | {
      type: "array"
      items: ModelArrayType<T>
      optional?: boolean
    }

export type ModelObjectType<T extends any> = {
  type: "object"
  properties: ModelProperties<T>
  required?: T[]
  optional?: boolean
}

export type ModelProperties<T extends any> = Record<string, ModelProperty<T>>

export type ModelScalerType =
  | {
      type: "boolean"
      optional?: boolean
      default?: boolean
    }
  | {
      type: "number"
      optional?: boolean
    }
  | {
      type: "string"
      optional?: boolean
      enum?: string[]
      contentMediaType?: "markdown"
    }

export type ModelArrayType<T extends any> = ModelScalerType | ModelObjectType<T>
