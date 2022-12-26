import { getAboutInfo } from "@gs/models/about/index.server"
import { getBlogSummaryItems } from "@gs/models/blog/index.server"
import { getCareerSummaryItems } from "@gs/models/career/index.server"
import { getEducationSummaryItems } from "@gs/models/education/index.server"
import { getProjectsSummaryItems } from "@gs/models/projects/index.server"
import { getUsersKeys } from "@gs/models/users/index.server"
import { authenticate } from "@gs/service/auth.server"
import type { SummaryItem } from "@gs/summary"

export function test() {
  return true
}

export async function about() {
  return await getAboutInfo()
}

interface QueryListOptions {
  limit?: number
}

interface Context {
  request: Request
}

export async function projects({
  limit,
}: QueryListOptions): Promise<SummaryItem[]> {
  const items = await getProjectsSummaryItems()
  if (limit) return items.slice(0, limit)
  else return items
}
export async function blog({
  limit,
}: QueryListOptions): Promise<SummaryItem[]> {
  const items = await getBlogSummaryItems()
  if (limit) return items.slice(0, limit)
  else return items
}
export async function education({
  limit,
}: QueryListOptions): Promise<SummaryItem[]> {
  const items = await getEducationSummaryItems()
  if (limit) return items.slice(0, limit)
  else return items
}
export async function career({
  limit,
}: QueryListOptions): Promise<SummaryItem[]> {
  const items = await getCareerSummaryItems()
  if (limit) return items.slice(0, limit)
  else return items
}
export async function users(
  { limit }: QueryListOptions,
  { request }: Context,
): Promise<string[]> {
  await authenticate(request)

  const items = await getUsersKeys()
  if (limit) return items.slice(0, limit)
  else return items
}

export async function setMessage(
  { message }: { message: string },
  { request }: Context,
): Promise<string> {
  await authenticate(request)

  return "Hi, " + message
}
