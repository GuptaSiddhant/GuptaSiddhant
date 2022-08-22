import clsx from "clsx"

import about from "./about/info"
import skills from "./about/skills"
import blog from "./blog"
import career from "./career"
import education from "./education"
import projects from "./projects"
import type { Model, ModelStyling } from "./types"

export enum ModelName {
  Projects = "projects",
  Blog = "blog",
  About = "about",
  Testimonies = "testimonies",
  Education = "education",
  Career = "career",
  Users = "users",
  Index = "index",
  Skills = "skills",
}

export type { Model }

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
    case ModelName.About:
      return about.model
    case ModelName.Skills:
      return skills.model
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

export function getLabelByModelName(modelName: ModelName): string {
  let label: string = ""
  Object.entries(ModelName).forEach(([key, value]) => {
    if (value === modelName) {
      label = key
    }
  })

  return label
}

export function verifyValidModelName(name: string): boolean {
  const modelNames = Object.values(ModelName) as string[]

  return modelNames.includes(name)
}
