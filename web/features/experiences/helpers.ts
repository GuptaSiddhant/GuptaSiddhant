import { DatabaseModel } from "@gs/service/database.server"
import { formatDate } from "@gs/utils/format"

import generateModelFromSchema from "../models"
import type {
  CareerProps,
  CommonExperienceProps,
  EducationProps,
  ExperienceProps,
} from "./types"

export function generateTagListFromExperienceProps(
  items: ExperienceProps[],
): string[] {
  const tags = items.map((item) => item.tags || []).flat()

  return Array.from(new Set(tags))
}

export function generateDurationString(
  { startDate, endDate }: CommonExperienceProps,
  options: Intl.DateTimeFormatOptions = {},
): string {
  const start = formatDate(startDate, { day: undefined, ...options })
  const end = endDate
    ? formatDate(endDate, { day: undefined, ...options })
    : "Present"

  return [start, end].filter(Boolean).join(" - ")
}

export function getEducationModel() {
  return generateModelFromSchema<keyof EducationProps>("EducationProps")
}

export function getCareerModel() {
  return generateModelFromSchema<keyof CareerProps>("CareerProps")
}

export function getBlogModel() {
  return generateModelFromSchema<keyof CareerProps>("BlogPostProps")
}

export function getModelByDatabaseModel(modelName: DatabaseModel) {
  switch (modelName) {
    case DatabaseModel.Career:
      return getCareerModel()
    case DatabaseModel.Education:
      return getEducationModel()
    case DatabaseModel.Blog:
      return getBlogModel()
    default:
      throw new Error(`Unknown model name: ${modelName}`)
  }
}
