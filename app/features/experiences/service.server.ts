import { sortByDate } from "~/features/helpers"

import {
  FirestoreCollection,
  getFirestoreCollection,
  getFirestoreDocument,
} from "../service/firestore.server"
import {
  transformCareerToExperience,
  transformEducationToExperience,
} from "./transformers"
import type { CareerProps, EducationProps, ExperienceProps } from "./types"

export async function getExperienceList(): Promise<ExperienceProps[]> {
  const [education, career] = await Promise.all([
    getEducationList(),
    getCareerList(),
  ])

  return [...education, ...career]
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

export async function getEducationList(): Promise<ExperienceProps[]> {
  const list =
    (await getFirestoreCollection<EducationProps>(
      FirestoreCollection.Education,
    )) || []

  return list
    .map(transformEducationToExperience)
    .sort((a, b) => sortByDate(a.startDate, b.startDate))
}

export async function getEducationItem(id: string): Promise<ExperienceProps> {
  const item = await getFirestoreDocument<EducationProps>(
    FirestoreCollection.Education,
    id,
  )

  return transformEducationToExperience(item)
}

export async function getCareerList(): Promise<ExperienceProps[]> {
  const list =
    (await getFirestoreCollection<CareerProps>(FirestoreCollection.Career)) ||
    []

  return list
    .map(transformCareerToExperience)
    .sort((a, b) => sortByDate(a.startDate, b.startDate))
}

export async function getCareerItem(id: string): Promise<ExperienceProps> {
  const item = await getFirestoreDocument<CareerProps>(
    FirestoreCollection.Career,
    id,
  )

  return transformCareerToExperience(item)
}
