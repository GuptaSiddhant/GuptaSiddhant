import Database, { DatabaseModel } from "@gs/service/database.server"
import { querySummaryItemsByModel } from "@gs/summary/service.server"
import { type TeaserProps } from "@gs/teaser"
import { getCrossSellTeasers } from "@gs/teaser/helpers"

import { type ProjectProps } from "."

const model = DatabaseModel.Projects

export const databaseProjects = new Database<ProjectProps>(model)

export async function getProjectsKeys() {
  return databaseProjects.queryKeys()
}

export async function getProjectsSummaryItems() {
  return querySummaryItemsByModel(model)
}

export async function getProjectDetails(id: string): Promise<ProjectProps> {
  const project = await databaseProjects.queryById(id)
  const cover: string | undefined = project.gallery?.[0]?.url

  return { ...project, cover }
}

export async function getProjectCrossSell(
  id: string,
  limit: number = 6,
): Promise<TeaserProps[]> {
  const teasers = await getProjectsSummaryItems()

  return getCrossSellTeasers(teasers, id).slice(0, limit)
}
