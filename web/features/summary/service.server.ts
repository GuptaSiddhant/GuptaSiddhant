import Database, { DatabaseModel } from "@gs/service/database.server"

import type { SummaryItem } from "./types"

const database = new Database<Record<string, SummaryItem> & { id: any }>(
  DatabaseModel.Index,
)

export async function querySummaryItemsByModel(
  model: DatabaseModel,
): Promise<SummaryItem[]> {
  const data = await database.queryById(model)

  return Object.values(data).filter((item) => typeof item === "object")
}
