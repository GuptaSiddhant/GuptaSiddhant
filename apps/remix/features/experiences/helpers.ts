import { formatDate } from "@gs/utils/format"

import { DatabaseModel } from "@features/service/database.server"

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

export function getModelByDatabaseModel(collectionName: DatabaseModel) {
  switch (collectionName) {
    case DatabaseModel.Career:
      return getCareerModel()
    case DatabaseModel.Education:
      return getEducationModel()
    default:
      throw new Error(`Unknown collection name: ${collectionName}`)
  }
}
