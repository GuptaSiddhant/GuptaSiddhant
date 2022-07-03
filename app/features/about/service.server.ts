import { sortByDate } from "~/features/helpers"
import {
  FirestoreCollection,
  getFirestoreCollection,
  getFirestoreDocument,
} from "~/features/service/firestore.server"

import type { AboutInfo, CareerProps, EducationProps, Skills } from "."

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
