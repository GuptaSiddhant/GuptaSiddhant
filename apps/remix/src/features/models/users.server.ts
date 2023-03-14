import { ModelName } from "@gs/models";
import Database from "@gs/service/database.server";
import { querySummaryItemsByModelName } from "@gs/summary/service.server";

import type { UserProps } from "./users.model";

const modelName = ModelName.Users;
const db = new Database<UserProps>(modelName);

export function getUsersModelName() {
  return modelName;
}

export function getUsersDatabase() {
  return db;
}

export async function getUsersKeys() {
  return db.queryKeys();
}

export async function getBlogSummaryItems() {
  return querySummaryItemsByModelName(modelName);
}

export async function getUser(
  id: string,
  ignoreCache?: boolean,
): Promise<UserProps> {
  return await db.queryById(id, ignoreCache);
}

export { UserProps };
