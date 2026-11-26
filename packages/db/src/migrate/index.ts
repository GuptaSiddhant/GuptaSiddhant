import { readFile } from "node:fs/promises";

import { type SourceData } from "./transform.ts";

export * from "./import.ts";
export * from "./transform.ts";

/**
 * Reads a backup file as produced by scripts/db-backup.js:
 * `{ [collection]: Document[] }`.
 */
export async function readBackupFile(path: string): Promise<SourceData> {
  const json = JSON.parse(await readFile(path, "utf8"));
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new Error(`${path}: expected an object of collections`);
  }
  return json as SourceData;
}
