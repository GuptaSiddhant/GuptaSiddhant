import {
  FirestoreCollection,
  getFirestoreCollection,
} from "~/packages/service/firestore.server"
import {
  getTeasersFromCollection,
  type TeaserProps,
} from "~/packages/helpers/teaser"

const collectionName = FirestoreCollection.Blog

export async function fetchBlogPostList(limit = 10): Promise<TeaserProps[]> {
  const collection = await getFirestoreCollection<TeaserProps>(collectionName)

  return getTeasersFromCollection(collection, limit)
}
