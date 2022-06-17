import {
  FirestoreCollection,
  getFirestoreCollection,
  getFirestoreDocument,
} from "~/features/service/firestore.server"
import { type TeaserProps } from "~/features/teaser"
import {
  getCrossSellTeasers,
  getTeasersFromCollection,
} from "~/features/teaser/helpers"

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

export async function getProjectCrossSell(
  id: string,
  limit: number = 6,
): Promise<TeaserProps[]> {
  const teasers = await getProjectTeaserList(100)

  return getCrossSellTeasers(teasers, id).slice(0, limit)
}
