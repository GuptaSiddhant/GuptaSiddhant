export type Schema = CoreSchemaMetaSchema1 & CoreSchemaMetaSchema2
export type NonNegativeInteger = number
export type NonNegativeIntegerDefault0 = NonNegativeInteger
export type CoreSchemaMetaSchema2 =
  | {
      $id?: string
      $schema?: string
      $ref?: string
      $comment?: string
      title?: string
      description?: string
      default?: true
      readOnly?: boolean
      writeOnly?: boolean
      examples?: true[]
      multipleOf?: number
      maximum?: number
      exclusiveMaximum?: number
      minimum?: number
      exclusiveMinimum?: number
      maxLength?: NonNegativeInteger
      minLength?: NonNegativeIntegerDefault0
      pattern?: string
      additionalItems?: CoreSchemaMetaSchema2
      items?: CoreSchemaMetaSchema2 | SchemaArray
      maxItems?: NonNegativeInteger
      minItems?: NonNegativeIntegerDefault0
      uniqueItems?: boolean
      contains?: CoreSchemaMetaSchema2
      maxProperties?: NonNegativeInteger
      minProperties?: NonNegativeIntegerDefault0
      required?: boolean
      additionalProperties?: CoreSchemaMetaSchema2
      definitions?: {
        [k: string]: CoreSchemaMetaSchema2
      }
      properties?: {
        [k: string]: CoreSchemaMetaSchema2
      }
      patternProperties?: {
        [k: string]: CoreSchemaMetaSchema2
      }
      dependencies?: {
        [k: string]: CoreSchemaMetaSchema2 | StringArray
      }
      propertyNames?: CoreSchemaMetaSchema2
      const?: true
      enum?: any[]
      type?: SimpleTypes | [SimpleTypes, ...SimpleTypes[]]
      format?: string
      contentMediaType?: string
      contentEncoding?: string
      if?: CoreSchemaMetaSchema2
      then?: CoreSchemaMetaSchema2
      else?: CoreSchemaMetaSchema2
      allOf?: SchemaArray
      anyOf?: SchemaArray
      oneOf?: SchemaArray
      not?: CoreSchemaMetaSchema2
      [k: string]: unknown
    }
  | boolean
export type SchemaArray = [CoreSchemaMetaSchema2, ...CoreSchemaMetaSchema2[]]
export type StringArray = string[]
export type SimpleTypes =
  | "array"
  | "boolean"
  | "integer"
  | "null"
  | "number"
  | "object"
  | "string"

export interface CoreSchemaMetaSchema1 {
  $id?: string
  $schema?: string
  $ref?: string
  $comment?: string
  title?: string
  description?: string
  default?: true
  readOnly?: boolean
  writeOnly?: boolean
  examples?: true[]
  multipleOf?: number
  maximum?: number
  exclusiveMaximum?: number
  minimum?: number
  exclusiveMinimum?: number
  maxLength?: NonNegativeInteger
  minLength?: NonNegativeIntegerDefault0
  pattern?: string
  additionalItems?: CoreSchemaMetaSchema2
  items?: CoreSchemaMetaSchema2 | SchemaArray
  maxItems?: NonNegativeInteger
  minItems?: NonNegativeIntegerDefault0
  uniqueItems?: boolean
  contains?: CoreSchemaMetaSchema2
  maxProperties?: NonNegativeInteger
  minProperties?: NonNegativeIntegerDefault0
  required?: boolean
  additionalProperties?: CoreSchemaMetaSchema2
  definitions?: {
    [k: string]: CoreSchemaMetaSchema2
  }
  properties?: {
    [k: string]: CoreSchemaMetaSchema2
  }
  patternProperties?: {
    [k: string]: CoreSchemaMetaSchema2
  }
  dependencies?: {
    [k: string]: CoreSchemaMetaSchema2 | StringArray
  }
  propertyNames?: CoreSchemaMetaSchema2
  const?: true
  enum?: any[]
  type?: SimpleTypes | [SimpleTypes, ...SimpleTypes[]]
  format?: string
  contentMediaType?: string
  contentEncoding?: string
  if?: CoreSchemaMetaSchema2
  then?: CoreSchemaMetaSchema2
  else?: CoreSchemaMetaSchema2
  allOf?: SchemaArray
  anyOf?: SchemaArray
  oneOf?: SchemaArray
  not?: CoreSchemaMetaSchema2
  [k: string]: unknown
}
