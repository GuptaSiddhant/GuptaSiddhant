import Database, { DatabaseModel } from "~/features/service/database.server"
import { type TeaserProps } from "~/features/teaser"
import {
  getCrossSellTeasers,
  getTeasersFromCollection,
} from "~/features/teaser/helpers"

import { type ProjectProps } from "."

export const databaseProjects = new Database<ProjectProps>(
  DatabaseModel.Projects,
)

export async function getProjectTeaserList(limit = 10): Promise<TeaserProps[]> {
  const list = await databaseProjects.queryAll()

  return getTeasersFromCollection(list, limit)
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
  const teasers = await getProjectTeaserList(100)

  return getCrossSellTeasers(teasers, id).slice(0, limit)
}
