import {
  FirestoreCollection,
  getFirestoreCollection,
} from "@gs/service/firestore.server"
import { getTeasersFromCollection, type TeaserProps } from "@gs/helpers/teaser"

const collectionName = FirestoreCollection.Projects

export async function getProjectList(limit = 10): Promise<TeaserProps[]> {
  const collection = await getFirestoreCollection(collectionName)

  return getTeasersFromCollection(collection, limit)
}
