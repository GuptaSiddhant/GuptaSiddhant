import Database, { ModelName } from "@gs/service/database.server"
import { type SummaryItem, getCrossSellSummaryItems } from "@gs/summary"
import { querySummaryItemsByModel } from "@gs/summary/service.server"
import type { Gallery, LinkObject } from "@gs/types"

const model = ModelName.Projects
const db = new Database<ProjectProps>(model)

export interface ProjectProps extends SummaryItem {
  association?: string
  dateEnd?: string
  dateStart: string
  content?: string
  links?: LinkObject[]
  gallery?: Gallery
}

export function getProjectsModelName() {
  return model
}

export function getProjectsDatabase() {
  return db
}

export async function getProjectsKeys() {
  return db.queryKeys()
}

export async function getProjectsSummaryItems() {
  return querySummaryItemsByModel(model)
}

export async function getProject(id: string): Promise<ProjectProps> {
  const project = await db.queryById(id)
  const cover: string | undefined = project.gallery?.[0]?.url

  return { ...project, cover }
}

export async function getProjectCrossSell(
  id: string,
  limit: number = 6,
): Promise<SummaryItem[]> {
  const items = await getProjectsSummaryItems()

  return getCrossSellSummaryItems(items, id).slice(0, limit)
}
