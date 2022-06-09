import {
  FirestoreCollection,
  getFirestoreCollection,
} from "~/packages/service/firestore.server"
import { type TeaserProps } from "~/packages/teaser"
import { getTeasersFromCollection } from "~/packages/teaser/helpers"

const collectionName = FirestoreCollection.Projects

export async function getProjectTeaserList(limit = 10): Promise<TeaserProps[]> {
  const collection = await getFirestoreCollection(collectionName)

  return getTeasersFromCollection(collection, limit)
}
