import { ModelName } from "@gs/models";
import Database from "@gs/service/database.server";

import { sortSummaryItemsByDateLatestFirstPredicate } from "./helpers";
import type { SummaryItem } from "./types";

const database = new Database<Record<string, SummaryItem> & { id: string }>(
  ModelName.Index,
);

export async function querySummaryItemsByModelName(
  modelName: ModelName,
  includeDrafts: boolean = false,
): Promise<SummaryItem[]> {
  const data = await database.queryById(modelName);

  return Object.values(data)
    .filter(
      <T>(item: T): item is Exclude<T, string> => typeof item !== "string",
    )
    .filter((item) => includeDrafts || __IS_DEV__ || !item.draft)
    .sort(sortSummaryItemsByDateLatestFirstPredicate);
}
