import { sortByDate } from "@gs/helpers"
import Database, { DatabaseModel } from "@gs/service/database.server"

import {
  transformCareerToExperience,
  transformEducationToExperience,
} from "./transformers"
import type { CareerProps, EducationProps, ExperienceProps } from "./types"

export const databaseCareer = new Database<CareerProps>(DatabaseModel.Career)
export const databaseEducation = new Database<EducationProps>(
  DatabaseModel.Education,
)

export async function getExperienceList(): Promise<ExperienceProps[]> {
  const [education, career] = await Promise.all([
    getEducationList(),
    getCareerList(),
  ])

  return [...education, ...career].filter((item) => __IS_DEV__ || !item.draft)
}

export async function getExperienceItem(id: string): Promise<ExperienceProps> {
  const [educationItem, careerItem] = await Promise.allSettled([
    getEducationItem(id),
    getCareerItem(id),
  ])

  if (careerItem.status === "fulfilled") return careerItem.value
  if (educationItem.status === "fulfilled") return educationItem.value

  throw new Error(`Experience item ${id} not found`)
}

export async function getEducationList(
  includeDrafts?: boolean,
): Promise<ExperienceProps[]> {
  const list = await databaseEducation.queryAll()

  return list
    .filter((item) => includeDrafts || __IS_DEV__ || !item.draft)
    .map(transformEducationToExperience)
    .sort((a, b) => sortByDate(a.startDate, b.startDate))
}

export async function getEducationItem(id: string): Promise<ExperienceProps> {
  const item = await databaseEducation.queryById(id)

  return transformEducationToExperience(item)
}

export async function getCareerList(
  includeDrafts?: boolean,
): Promise<ExperienceProps[]> {
  const list = await databaseCareer.queryAll()

  return list
    .filter((item) => includeDrafts || __IS_DEV__ || !item.draft)
    .map(transformCareerToExperience)
    .sort((a, b) => sortByDate(a.startDate, b.startDate))
}

export async function getCareerItem(id: string): Promise<ExperienceProps> {
  const item = await databaseCareer.queryById(id)

  return transformCareerToExperience(item)
}
