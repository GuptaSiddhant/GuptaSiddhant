import {
  FirestoreCollection,
  getFirestoreCollection,
  getFirestoreDocument,
} from "~/packages/service/firestore.server"
import { type TeaserProps } from "~/packages/teaser"
import { getTeasersFromCollection } from "~/packages/teaser/helpers"

import { type ProjectProps } from "."

const collectionName = FirestoreCollection.Projects

export async function getProjectTeaserList(limit = 10): Promise<TeaserProps[]> {
  const collection = await getFirestoreCollection(collectionName)

  return getTeasersFromCollection(collection, limit)
}

export async function getProjectDetails(id: string): Promise<ProjectProps> {
  const project = await getFirestoreDocument<ProjectProps>(collectionName, id)
  const cover: string | undefined = project.gallery?.[0]?.url

  return { ...project, cover }
}
