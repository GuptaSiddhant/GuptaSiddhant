import {
  FirestoreCollection,
  getFirestoreDocument,
} from "~/features/service/firestore.server"

import type { AboutInfo, Skills } from "."

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
