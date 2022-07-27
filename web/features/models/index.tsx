import clsx from "clsx"
import ProjectsIcon from "remixicon-react/ArtboardLineIcon"
import EducationIcon from "remixicon-react/BookFillIcon"
import CareerIcon from "remixicon-react/Briefcase5FillIcon"
import BlogIcon from "remixicon-react/QuillPenLineIcon"

import type { Schema } from "./schema-type"
import {
  blogSchema,
  careerSchema,
  educationSchema,
  projectSchema,
} from "./schemas"

export enum DatabaseModel {
  Projects = "projects",
  Blog = "blog",
  About = "about",
  Testimonies = "testimonies",
  Education = "education",
  Career = "career",
  Users = "users",
  Index = "index",
}

export function getModelByDatabaseModel(modelName: DatabaseModel) {
  switch (modelName) {
    case DatabaseModel.Career:
      return transformSchemaInModel(careerSchema)
    case DatabaseModel.Education:
      return transformSchemaInModel(educationSchema)
    case DatabaseModel.Blog:
      return transformSchemaInModel(blogSchema)
    case DatabaseModel.Projects:
      return transformSchemaInModel(projectSchema)
    default:
      throw new Error(`Unknown model name: ${modelName}`)
  }
}

export function getStylingByDatabaseModel(modelName: DatabaseModel): {
  text: string
  border: string
  bg: string
  icon?: React.ReactNode
} {
  switch (modelName) {
    case DatabaseModel.Career: {
      return {
        bg: clsx("bg-purple-500"),
        text: clsx("text-purple-500"),
        border: clsx(
          "group-hocus:border-purple-500 selected:border-purple-500",
        ),
        icon: <CareerIcon />,
      }
    }
    case DatabaseModel.Education: {
      return {
        bg: clsx("bg-red-500"),
        text: clsx("text-red-500"),
        border: clsx("group-hocus:border-red-500 selected:border-red-500"),
        icon: <EducationIcon />,
      }
    }
    case DatabaseModel.Projects: {
      return {
        bg: clsx("bg-green-500"),
        text: clsx("text-green-500"),
        border: clsx("group-hocus:border-green-500 selected:border-green-500"),
        icon: <ProjectsIcon />,
      }
    }
    case DatabaseModel.Blog: {
      return {
        bg: clsx("bg-blue-500"),
        text: clsx("text-blue-500"),
        border: clsx("group-hocus:border-blue-500 selected:border-green-500"),
        icon: <BlogIcon />,
      }
    }
    default: {
      return {
        bg: clsx("bg-secondary"),
        text: clsx("text-secondary"),
        border: clsx("selected:border-secondary group-hocus:border-secondary"),
      }
    }
  }
}

function transformSchemaInModel(schema: Schema): Model {
  const model = {
    type: "object",
    properties: schema.properties || {},
  }

  const required = schema.required || []
  Object.keys(model.properties).forEach((key) => {
    const optional = required.indexOf(key) === -1
    ;(model.properties[key] as any).optional = optional
    ;(model.properties[key] as any).required = !optional
  })

  return model as Model
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
