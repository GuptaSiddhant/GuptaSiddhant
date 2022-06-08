import {
  type TeaserProps,
  getTeasersFromCollection,
} from "~/packages/helpers/teaser"
import {
  FirestoreCollection,
  getFirestoreCollection,
} from "~/packages/service/firestore.server"

const collectionName = FirestoreCollection.Blog

export async function fetchBlogPostList(limit = 10): Promise<TeaserProps[]> {
  const collection = await getFirestoreCollection<TeaserProps>(collectionName)

  return getTeasersFromCollection(collection, limit)
}
