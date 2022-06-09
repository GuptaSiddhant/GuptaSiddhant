import {
  FirestoreCollection,
  getFirestoreCollection,
} from "~/packages/service/firestore.server"
import { type TeaserProps } from "~/packages/teaser"
import { getTeasersFromCollection } from "~/packages/teaser/helpers"

const collectionName = FirestoreCollection.Blog

export async function getBlogPostTeaserList(
  limit = 10,
): Promise<TeaserProps[]> {
  const collection = await getFirestoreCollection<TeaserProps>(collectionName)

  return getTeasersFromCollection(collection, limit)
}
