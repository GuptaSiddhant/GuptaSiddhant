import Database, { ModelName } from "@gs/service/database.server"
import { type SummaryItem, getCrossSellSummaryItems } from "@gs/summary"
import { querySummaryItemsByModel } from "@gs/summary/service.server"
import type { Gallery, LinkObject } from "@gs/types"

const model = ModelName.Blog
const db = new Database<BlogPostProps>(model)

export interface BlogPostProps extends SummaryItem {
  association?: string
  content?: string
  links?: LinkObject[]
  gallery?: Gallery
}

export function getBlogModelName() {
  return model
}

export function getBlogDatabase() {
  return db
}

export async function getBlogKeys() {
  return db.queryKeys()
}

export async function getBlogSummaryItems() {
  return querySummaryItemsByModel(model)
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
