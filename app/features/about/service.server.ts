import {
  FirestoreCollection,
  getFirestoreDocument,
} from "~/features/service/firestore.server"

import { type AboutInfo } from "."

export async function getAboutInfo() {
  const about = await getFirestoreDocument<AboutInfo>(
    FirestoreCollection.Info,
    "about",
  )

  if (!about) throw new Error("No about info found")

  return about
}
