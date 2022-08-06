import Database from "@gs/service/database.server"
import { ModelName } from "@gs/models"
import { type SummaryItem, getCrossSellSummaryItems } from "@gs/summary"
import { querySummaryItemsByModelName } from "@gs/summary/service.server"

import type { BlogPostProps } from "./blog.model"

const modelName = ModelName.Blog
const db = new Database<BlogPostProps>(modelName)

export function getBlogModelName() {
  return modelName
}

export function getBlogDatabase() {
  return db
}

export async function getBlogKeys() {
  return db.queryKeys()
}

export async function getBlogSummaryItems() {
  return querySummaryItemsByModelName(modelName)
}

export async function getBlogPost(id: string): Promise<BlogPostProps> {
  const post = await db.queryById(id)
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

export { BlogPostProps }
