import Database, { DatabaseModel } from "~/features/service/database.server"
import { type TeaserProps } from "~/features/teaser"
import {
  getCrossSellTeasers,
  getTeasersFromCollection,
} from "~/features/teaser/helpers"

import { type BlogPostProps } from "."

export const databaseBlog = new Database<BlogPostProps>(DatabaseModel.Blog)

export async function getBlogPostTeaserList(
  limit = 10,
): Promise<TeaserProps[]> {
  const collection = await databaseBlog.queryAll()

  return getTeasersFromCollection(collection, limit)
}

export async function getBlogPostDetails(id: string): Promise<BlogPostProps> {
  const post = await databaseBlog.queryById(id)
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
