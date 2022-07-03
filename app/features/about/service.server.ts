import { sortByDate } from "~/features/helpers"
import {
  FirestoreCollection,
  getFirestoreCollection,
  getFirestoreDocument,
} from "~/features/service/firestore.server"

import { appLogger } from "../service/logger.server"
import type {
  AboutInfo,
  CareerProps,
  CommonCareerEducationProps,
  EducationProps,
  Skills,
} from "."

export async function getAboutInfo() {
  return getFirestoreDocument<AboutInfo>(FirestoreCollection.Info, "about")
}

export async function getSkills() {
  const { backend, design, frontend, language, soft } =
    await getFirestoreDocument<Skills>(FirestoreCollection.Info, "skills")
  return {
    backend,
    design,
    frontend,
    language,
    soft,
  }
}

export async function getEducationList(): Promise<EducationProps[]> {
  const educationList =
    (await getFirestoreCollection<EducationProps>(
      FirestoreCollection.Education,
    )) || []

  return educationList.sort((a, b) => sortByDate(a.startDate, b.startDate))
}

export async function getCareerList(): Promise<CareerProps[]> {
  const careerList =
    (await getFirestoreCollection<CareerProps>(FirestoreCollection.Career)) ||
    []

  return careerList.sort((a, b) => sortByDate(a.startDate, b.startDate))
}

export async function getEducationEntry(id: string) {
  return getFirestoreDocument<EducationProps>(FirestoreCollection.Education, id)
}

export async function getCareerEntry(id: string) {
  return getFirestoreDocument<CareerProps>(FirestoreCollection.Career, id)
}

export async function getEducationOrCareerEntry(
  id?: string,
): Promise<CommonCareerEducationProps | undefined> {
  if (!id) return undefined

  // try {
  const [education, career] = await Promise.allSettled([
    getEducationEntry(id),
    getCareerEntry(id),
  ])

  if (education.status === "fulfilled") return education.value
  if (career.status === "fulfilled") return career.value

  appLogger.warn(`getEducationOrCareerEntry: No entry found for ${id}`)
  return undefined
}
