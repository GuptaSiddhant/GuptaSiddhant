# gs-db

Drizzle ORM schema, libSQL (Turso) client and Firestore migration helpers
(Phase 3 of #40, tracked in #42). Production still reads Firestore; nothing in
`apps/*` imports this package yet.

The package is named `gs-db` (not `@gs/db`) because `apps/remix` maps `@gs/*`
to `src/features/*` in its tsconfig, which would shadow a scoped package.

## Schema overview

`src/schema.ts`, SQL in `drizzle/` (generated, committed).

| Firestore                 | Table          | Notes                                                                                                |
| ------------------------- | -------------- | ---------------------------------------------------------------------------------------------------- |
| `projects`                | `projects`     | `date_start` required, `date_end`; index `(draft, date_start DESC)`                                  |
| `blog`                    | `blog`         | `date` required; index `(draft, date DESC)`                                                          |
| `career`                  | `career`       | `type` kept as-is (legacy values exist) plus `role_type`                                             |
| `education`               | `education`    |                                                                                                      |
| `testimonies`             | `testimonies`  |                                                                                                      |
| `users`                   | `users`        | `role` is GUEST / EDITOR / ADMIN                                                                     |
| `about/info`              | `about_info`   | single row, `id = "info"`; nested parts are JSON                                                     |
| `about/skills`            | `about_skills` | single row, `id = "skills"`; one JSON column per category                                            |
| `index` (derived summary) | not stored     | computed by `queryIndex(db, model)` in `src/index-items.ts`, mirroring `apps/functions/update-index` |

- Ids are the Firestore document ids (text primary keys).
- Dates are integers (`timestamp_ms`, UTC) and surface as `Date`.
- `tags`, `links`, `gallery` and the `about_*` objects are JSON columns; there
  is nothing to join or filter on.
- `draft` and `featured` are real boolean columns (default `false`; the app
  treats a missing `draft` as published).
- The `index` collection only existed because Firestore cannot cheaply list
  projections. In SQL it is a `SELECT` over four tables, so it is derived and
  cannot go stale; the cache-bust call in the Cloud Function is no longer
  needed. Durations are formatted as `en-US`, UTC.

Change the schema, then `pnpm db:generate` (drizzle-kit) and commit the new SQL.

## Client

```ts
import { createDb, migrateDb, schema } from "gs-db";

const db = createDb({
  url: process.env.TURSO_DATABASE_URL!, // libsql://... or file:./local.db
  authToken: process.env.TURSO_AUTH_TOKEN,
});
await migrateDb(db); // applies drizzle/*.sql
```

## Migrating data

`scripts/migrate-firestore-to-turso/index.ts` (Node 24 type stripping, no
build). It applies the SQL migrations, then upserts every row
(`ON CONFLICT(id) DO UPDATE`) in one transaction, so it can be re-run safely.
It prints per-collection counts (rows, inserted, updated) and warnings for
fields/documents it ignores (e.g. the legacy `blog` / `projects` maps in the
backup's `info` collection). A document missing a required field fails the run.

Locally, from a backup, against a file database:

```sh
TURSO_DATABASE_URL=file:./local.db \
  node scripts/migrate-firestore-to-turso/index.ts --from-backup backup/backup.json
node scripts/migrate-firestore-to-turso/index.ts --from-backup backup/backup.json --dry-run
```

Against live Firestore (read-only) set `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON) or
`GOOGLE_APPLICATION_CREDENTIALS` and omit `--from-backup`.

Files: `--copy-storage` streams every Firebase Storage object
(`guptasiddhant-com.appspot.com`, or `FIREBASE_STORAGE_BUCKET`) to R2 with the
same object key. Objects already in R2 with the same size are skipped, so it is
resumable. Needs `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
`R2_BUCKET`. `--prefix <path>` limits the copy. `--dry-run` lists what would be
copied and writes nothing.

### Via GitHub Actions

Actions > "Migrate data (Firestore to Turso / R2)" > Run workflow. Inputs:
`dry_run` (default **true**), `migrate_database` (default on), `copy_storage`
(default off). Secrets: `FIREBASE_SERVICE_ACCOUNT_GUPTASIDDHANT_COM`,
`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`,
`R2_SECRET_ACCESS_KEY`, `R2_BUCKET`. Run a dry run first, then untick `dry_run`.
Note a database dry run only reads Firestore and prints counts; it does not
connect to Turso.

## Tests

`pnpm --filter gs-db test` runs backup -> transform -> `file:` libSQL end to
end (counts, date and nested gallery round-trips, idempotency, derived index)
and the CLI itself. They run in CI.

## Follow-up: switching reads (Phase 3b)

1. Provision Turso and R2, set the env vars in Vercel, run the workflow
   (dry run, then real), verify counts against Firestore.
2. Reimplement `apps/remix/src/features/service/database.server.ts` on
   Drizzle behind the same `Database` API (`queryById`, `queryKeys`,
   `queryAll`, `mutateById`, cache invalidation), so `models/*.server.ts`
   keep their function signatures. Map rows back to the current document
   shapes (`Date` -> ISO string, `null` -> absent) in one place.
3. Serve the `index` model from `queryIndex`; drop the `update-index`
   function and its cache-bust call.
4. Replace the Firebase Storage signed URLs with R2 (`R2_PUBLIC_URL` if set,
   else presigned URLs) in `features/firebase/storage.ts` / `storage.server.ts`.
5. Ship behind a flag (or a short dual-read comparison), re-run the migration
   just before cutover, then remove firebase-admin from the app.

## Known data quirks (kept verbatim)

- `content` and `terminalResume.code` in the backup are JSON-encoded string
  literals (they start and end with a double quote); migrated unchanged.
- Some `career` documents carry both `type` (legacy, e.g. "self-employed")
  and `roleType`; both are stored.
