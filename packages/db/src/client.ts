import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

import * as schema from "./schema.ts";

export interface CreateDbOptions {
  /** `libsql://...` (Turso), `file:./local.db` or `:memory:`. */
  url: string;
  authToken?: string;
}

export type Db = ReturnType<typeof createDb>;

export function createDb({ url, authToken }: CreateDbOptions) {
  const client = createClient({ url, authToken: authToken || undefined });
  return drizzle(client, { schema });
}

/** Reads TURSO_DATABASE_URL / TURSO_AUTH_TOKEN. */
export function createDbFromEnv(env: NodeJS.ProcessEnv = process.env) {
  const url = env.TURSO_DATABASE_URL;
  if (!url) throw new Error("TURSO_DATABASE_URL is not set");
  return createDb({ url, authToken: env.TURSO_AUTH_TOKEN });
}

/** Applies the generated SQL migrations in `packages/db/drizzle`. */
export async function migrateDb(db: Db) {
  await migrate(db, {
    migrationsFolder: new URL("../drizzle", import.meta.url).pathname,
  });
}
