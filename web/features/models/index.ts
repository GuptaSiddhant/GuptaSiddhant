import clsx from "clsx"

import blog from "./blog.model"
import career from "./career.model"
import education from "./education.model"
import type { Model, ModelStyling } from "./helpers/model.types"
import projects from "./projects.model"

export enum ModelName {
  Projects = "projects",
  Blog = "blog",
  About = "about",
  Testimonies = "testimonies",
  Education = "education",
  Career = "career",
  Users = "users",
  Index = "index",
}

export type { Model }
export * from "./helpers/model.helpers"

export function getModelByModelName(modelName: ModelName) {
  switch (modelName) {
    case ModelName.Career:
      return career.model
    case ModelName.Education:
      return education.model
    case ModelName.Blog:
      return blog.model
    case ModelName.Projects:
      return projects.model
    default:
      throw new Error(`Unknown model name: ${modelName}`)
  }
}

export function getStylingByModelName(modelName: ModelName): ModelStyling {
  switch (modelName) {
    case ModelName.Career:
      return career.styling
    case ModelName.Education:
      return education.styling
    case ModelName.Projects:
      return projects.styling
    case ModelName.Blog:
      return blog.styling
    default: {
      return {
        bg: clsx("bg-secondary"),
        text: clsx("text-secondary"),
        border: clsx("border-secondary"),
        borderHocus: clsx(
          "selected:border-secondary group-hocus:border-secondary",
        ),
      }
    }
  }
}
