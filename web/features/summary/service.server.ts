import Database, { ModelName } from "@gs/service/database.server"

import type { SummaryItem } from "./types"

const database = new Database<Record<string, SummaryItem> & { id: any }>(
  ModelName.Index,
)

export async function querySummaryItemsByModel(
  model: ModelName,
  includeDrafts: boolean = false,
): Promise<SummaryItem[]> {
  const data = await database.queryById(model)

  return Object.values(data)
    .filter((item) => typeof item === "object")
    .filter((item) => includeDrafts || __IS_DEV__ || !item.draft)
}
