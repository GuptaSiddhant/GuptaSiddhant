#!/usr/bin/env node
/**
 * Firestore -> Turso (libSQL) / Firebase Storage -> Cloudflare R2.
 *
 *   node scripts/migrate-firestore-to-turso/index.ts [options]
 *
 * Data mode (default): read Firestore (or --from-backup), transform, apply the
 * SQL migrations and upsert rows into TURSO_DATABASE_URL. Re-runnable.
 * Storage mode (--copy-storage): copy Firebase Storage objects to R2.
 *
 * Run `node ... --help` for all options.
 */
import { parseArgs } from "node:util";

import { createDb, migrateDb } from "../../packages/db/src/index.ts";
import {
  importData,
  summarizeData,
  transformFirestoreData,
  type CollectionResult,
} from "../../packages/db/src/migrate/index.ts";
import { readBackup, readFirestore } from "./firestore.ts";

const HELP = `Usage: node scripts/migrate-firestore-to-turso/index.ts [options]

  --from-backup <file>   Read a JSON backup (e.g. backup/backup.json) instead of live Firestore
  --copy-storage         Copy Firebase Storage objects to R2 (instead of migrating data)
  --prefix <path>        With --copy-storage: only objects under this prefix
  --dry-run              Read and transform/list only; write nothing
  --help                 Show this help

Environment
  TURSO_DATABASE_URL, TURSO_AUTH_TOKEN     target database (libsql://... or file:./local.db)
  FIREBASE_SERVICE_ACCOUNT_KEY             service account JSON (live Firestore / Storage)
  GOOGLE_APPLICATION_CREDENTIALS           ...or path to a service account key file
  FIREBASE_STORAGE_BUCKET                  default guptasiddhant-com.appspot.com
  R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET   R2 target
`;

const { values } = parseArgs({
  options: {
    "from-backup": { type: "string" },
    "copy-storage": { type: "boolean", default: false },
    prefix: { type: "string" },
    "dry-run": { type: "boolean", default: false },
    help: { type: "boolean", default: false },
  },
  strict: true,
});

if (values.help) {
  console.log(HELP);
  process.exit(0);
}

const dryRun = values["dry-run"]!;
if (dryRun) console.log("DRY RUN: nothing will be written.\n");

if (values["copy-storage"]) {
  await runStorage();
} else {
  await runData();
}

async function runData() {
  const backupPath = values["from-backup"];
  console.log(
    backupPath
      ? `Source: backup file ${backupPath}`
      : "Source: live Firestore (read-only)",
  );
  const source = backupPath ? readBackup(backupPath) : await readFirestore();
  const { data, warnings } = transformFirestoreData(source);
  for (const warning of warnings) console.warn(`warning: ${warning}`);

  let results: CollectionResult[];
  if (dryRun) {
    results = summarizeData(data);
  } else {
    const url = process.env.TURSO_DATABASE_URL;
    if (!url) throw new Error("TURSO_DATABASE_URL is not set");
    console.log(`Target: ${url.replace(/\?.*$/, "")}`);
    const db = createDb({ url, authToken: process.env.TURSO_AUTH_TOKEN });
    await migrateDb(db);
    results = await importData(db, data);
  }

  console.log("\nCollection        table           rows  inserted  updated");
  for (const r of results) {
    console.log(
      `${r.collection.padEnd(17)} ${r.table.padEnd(15)} ${String(r.total).padStart(4)}  ${String(r.inserted).padStart(8)}  ${String(r.updated).padStart(7)}`,
    );
  }
  const total = results.reduce((sum, r) => sum + r.total, 0);
  console.log(
    `\n${dryRun ? "Would upsert" : "Upserted"} ${total} rows.${dryRun ? " (dry run: inserted/updated not computed)" : ""}`,
  );
}

async function runStorage() {
  if (values["from-backup"]) {
    throw new Error(
      "--copy-storage reads live Firebase Storage; drop --from-backup",
    );
  }
  const { copyStorageToR2 } = await import("./storage.ts");
  const result = await copyStorageToR2({ dryRun, prefix: values.prefix });
  console.log(
    `\nStorage: ${result.total} objects, ${dryRun ? "would copy" : "copied"} ${result.copied} (${result.bytes} bytes), skipped ${result.skipped}, failed ${result.failed}.`,
  );
  if (result.failed > 0) process.exit(1);
}
