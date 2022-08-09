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
      required?: boolean
    }

export type ModelObjectType<T extends any> = {
  type: "object"
  properties: ModelProperties<T>
  required?: boolean
}

export type ModelProperties<T extends any> = Record<string, ModelProperty<T>>

export type ModelScalerType =
  | {
      type: "boolean"
      required?: boolean
      default?: boolean
    }
  | {
      type: "number"
      required?: boolean
    }
  | {
      type: "string"
      required?: boolean
      enum?: string[]
      contentMediaType?: "markdown" | "code"
    }
  | ModelObjectType<any>

export type ModelArrayType<T extends any> = ModelScalerType | ModelObjectType<T>
