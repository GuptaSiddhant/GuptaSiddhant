import { getBlogSummaryItems } from "@gs/models/blog/index.server"
import { getCareerSummaryItems } from "@gs/models/career/index.server"
import { getEducationSummaryItems } from "@gs/models/education/index.server"
import { getProjectsSummaryItems } from "@gs/models/projects/index.server"
import type { SummaryItem } from "@gs/summary"

export function test() {
  return true
}

interface Options {
  limit?: number
}

export async function projects({ limit }: Options): Promise<SummaryItem[]> {
  const items = await getProjectsSummaryItems()
  if (limit) return items.slice(0, limit)
  else return items
}
export async function blog({ limit }: Options): Promise<SummaryItem[]> {
  const items = await getBlogSummaryItems()
  if (limit) return items.slice(0, limit)
  else return items
}
export async function education({ limit }: Options): Promise<SummaryItem[]> {
  const items = await getEducationSummaryItems()
  if (limit) return items.slice(0, limit)
  else return items
}
export async function career({ limit }: Options): Promise<SummaryItem[]> {
  const items = await getCareerSummaryItems()
  if (limit) return items.slice(0, limit)
  else return items
}
