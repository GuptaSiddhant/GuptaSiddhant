import Database, { DatabaseModel } from "@gs/service/database.server"
import { type SummaryItem, getCrossSellSummaryItems } from "@gs/summary"
import { querySummaryItemsByModel } from "@gs/summary/service.server"

import { type BlogPostProps } from "."

const model = DatabaseModel.Blog

export const databaseBlog = new Database<BlogPostProps>(model)

export async function getBlogPostKeys() {
  return databaseBlog.queryKeys()
}

export async function getBlogSummaryItems() {
  return querySummaryItemsByModel(model)
}

export async function getBlogPostDetails(id: string): Promise<BlogPostProps> {
  const post = await databaseBlog.queryById(id)
  const cover: string | undefined = post.gallery?.[0]?.url

  return { ...post, cover }
}

export async function getBlogPostCrossSell(
  id: string,
  limit: number = 6,
): Promise<SummaryItem[]> {
  const items = await getBlogSummaryItems()

  return getCrossSellSummaryItems(items, id).slice(0, limit)
}
