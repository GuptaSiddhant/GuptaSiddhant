import { getTableColumns, getTableName, sql } from "drizzle-orm";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";

import type { Db } from "../client.ts";
import * as schema from "../schema.ts";
import type { MigrationData } from "./transform.ts";

export interface CollectionResult {
  /** Firestore collection (or doc group) name. */
  collection: string;
  table: string;
  /** Rows given. */
  total: number;
  inserted: number;
  updated: number;
}

const CHUNK_SIZE = 50;

/** Upsert order does not matter (no foreign keys), kept stable for output. */
const targets = [
  ["projects", schema.projects],
  ["blog", schema.blog],
  ["career", schema.career],
  ["education", schema.education],
  ["testimonies", schema.testimonies],
  ["users", schema.users],
  ["about/info", schema.aboutInfo],
  ["about/skills", schema.aboutSkills],
] as const;

const dataKeys: Record<string, keyof MigrationData> = {
  projects: "projects",
  blog: "blog",
  career: "career",
  education: "education",
  testimonies: "testimonies",
  users: "users",
  "about/info": "aboutInfo",
  "about/skills": "aboutSkills",
};

/**
 * Idempotently writes all rows (INSERT ... ON CONFLICT(id) DO UPDATE) in a
 * single transaction. Re-running with the same input leaves the same state.
 */
export async function importData(
  db: Db,
  data: MigrationData,
): Promise<CollectionResult[]> {
  return db.transaction(async (tx) => {
    const results: CollectionResult[] = [];
    for (const [collection, table] of targets) {
      const rows = data[dataKeys[collection]!] as Record<string, unknown>[];
      results.push(
        await upsertRows(tx as unknown as Db, collection, table, rows),
      );
    }
    return results;
  });
}

/** Row counts per collection without touching a database (dry run). */
export function summarizeData(data: MigrationData): CollectionResult[] {
  return targets.map(([collection, table]) => {
    const total = (data[dataKeys[collection]!] as unknown[]).length;
    return {
      collection,
      table: getTableName(table),
      total,
      inserted: 0,
      updated: 0,
    };
  });
}

async function upsertRows(
  db: Db,
  collection: string,
  table: SQLiteTable & { id: any },
  rows: Record<string, unknown>[],
): Promise<CollectionResult> {
  const tableName = getTableName(table);
  const columns = getTableColumns(table);
  const before = await existingIds(db, tableName);
  const inserted = rows.filter((r) => !before.has(String(r.id))).length;

  const set = Object.fromEntries(
    Object.entries(columns)
      .filter(([key]) => key !== "id")
      .map(([key, column]) => [key, sql.raw(`excluded."${column.name}"`)]),
  );

  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    await db
      .insert(table)
      .values(rows.slice(i, i + CHUNK_SIZE) as any)
      .onConflictDoUpdate({ target: table.id, set });
  }

  return {
    collection,
    table: tableName,
    total: rows.length,
    inserted,
    updated: rows.length - inserted,
  };
}

async function existingIds(db: Db, tableName: string): Promise<Set<string>> {
  const result = await db.all<{ id: string }>(
    sql`select id from ${sql.identifier(tableName)}`,
  );
  return new Set(result.map((r) => r.id));
}
