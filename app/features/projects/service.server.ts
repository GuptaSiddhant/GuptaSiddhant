import {
  type TeaserProps,
  getTeasersFromCollection,
} from "~/packages/helpers/teaser"
import {
  FirestoreCollection,
  getFirestoreCollection,
} from "~/packages/service/firestore.server"

const collectionName = FirestoreCollection.Projects

export async function getProjectList(limit = 10): Promise<TeaserProps[]> {
  const collection = await getFirestoreCollection(collectionName)

  return getTeasersFromCollection(collection, limit)
}
