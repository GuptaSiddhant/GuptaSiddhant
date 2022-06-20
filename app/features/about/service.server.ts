import {
  FirestoreCollection,
  getFirestoreCollection,
  getFirestoreDocument,
} from "~/features/service/firestore.server"

import { sortByDate } from "../helpers"
import type { AboutInfo, CareerProps, EducationProps } from "."

export async function getAboutInfo() {
  const about = await getFirestoreDocument<AboutInfo>(
    FirestoreCollection.Info,
    "about",
  )

  if (!about) throw new Error("No about info found")

  return about
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
