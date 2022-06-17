import {
  FirestoreCollection,
  getFirestoreCollection,
  getFirestoreDocument,
} from "~/packages/service/firestore.server"
import { type TeaserProps } from "~/packages/teaser"
import {
  getCrossSellTeasers,
  getTeasersFromCollection,
} from "~/packages/teaser/helpers"

import { type BlogPostProps } from "."

const collectionName = FirestoreCollection.Blog

export async function getBlogPostTeaserList(
  limit = 10,
): Promise<TeaserProps[]> {
  const collection = await getFirestoreCollection<TeaserProps>(collectionName)

  return getTeasersFromCollection(collection, limit)
}

export async function getBlogPostDetails(id: string): Promise<BlogPostProps> {
  const post = await getFirestoreDocument<BlogPostProps>(collectionName, id)
  const cover: string | undefined = post.gallery?.[0]?.url

  return { ...post, cover }
}

export async function getBlogPostCrossSell(
  id: string,
  limit: number = 6,
): Promise<TeaserProps[]> {
  const teasers = await getBlogPostTeaserList(100)

  return getCrossSellTeasers(teasers, id).slice(0, limit)
}
