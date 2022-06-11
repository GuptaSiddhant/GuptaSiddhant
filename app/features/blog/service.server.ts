import {
  FirestoreCollection,
  getFirestoreCollection,
  getFirestoreDocument,
} from "~/packages/service/firestore.server"
import { type TeaserProps } from "~/packages/teaser"
import { getTeasersFromCollection } from "~/packages/teaser/helpers"

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
