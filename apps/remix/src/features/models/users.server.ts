import { ModelName } from "@gs/models";
import Database from "@gs/service/database.server";

import type { UserProps } from "./users.model";

const modelName = ModelName.Users;
const db = new Database<UserProps>(modelName);

export function getUsersModelName() {
  return modelName;
}

export function getUsersDatabase() {
  return db;
}

export const getUserById = db.queryById;
export const getUsers = db.queryAll;
export const getUserKeys = db.queryKeys;

export type { UserProps };
