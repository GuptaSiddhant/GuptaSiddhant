# Architecture

Status as of Nov 2026. This document sets the direction for the monorepo.

## 1. Purpose

This monorepo is a personal portfolio and a playground for modern tech.

- **Portfolio**: guptasiddhant.com shows projects, blog, career, education, and testimonies.
- **Playground**: new frameworks and tools get tried here first, in isolated apps.

## 2. Current state (Nov 2026)

| App | What it is | Hosting |
|---|---|---|
| `apps/remix` | Main site on Remix 2.1 (classic compiler) | Vercel, guptasiddhant.com |
| `apps/next` | Next 13.4 scaffold | Vercel, next.guptasiddhant.com |
| `apps/cli` | Ink CLI, `npx guptasiddhant`, reads `guptasiddhant.com/api` | npm |
| `apps/functions` | Firebase `onWrite` function: updates `index` docs and purges the site cache | Firebase |

Data and services:

- **Firestore** collections: `projects`, `blog`, `career`, `education`, `testimonies`, `info`, `about`, `users`, `index`. Total size is about 70 KB.
- **Firebase Storage** for uploaded files.
- **Upstash Redis** plus an in-process LRU cache for API and page data.
- **Firebase Auth** for the admin CMS.

## 3. Target architecture

| Layer | Current | Target | Rationale |
|---|---|---|---|
| Main site | Remix 2.1 (classic compiler) on Vercel | React Router v8 (Vite, ESM-only) on Vercel | Official Remix successor, stable since June 2026. The move is codemod-driven in two steps, not a rewrite. |
| Database | Firestore | Turso (libSQL/SQLite) via Drizzle ORM | Owner wants SQLite. Turso works on serverless Vercel. Drizzle gives typed schema and migrations. |
| Backups | Not in place | Turso point-in-time restore, plus a scheduled SQL dump (optionally kept in R2) | Two independent recovery paths. |
| Files | Firebase Storage | Cloudflare R2 | S3-compatible, free egress, 10 GB free tier. |
| Auth | Firebase Auth | Better Auth with passkeys, tables in the same Turso DB | One database, passwordless login, no Firebase dependency. |
| Cache | Upstash Redis + LRU | Vercel CDN cache via `Cache-Control` | Removes a service. Content is small and changes rarely. |
| Cloud Function | Firebase `onWrite` | Removed | Replaces the `index` docs and cache purge with the new data layer. |
| Next app | Next 13.4 scaffold | Latest Next and React 19, kept as a playground | Keeps a current framework to try new ideas on. |
| CLI | Ink CLI, plain API calls | Same API, with timeouts, published via npm trusted publishing (OIDC) | No long-lived npm token to leak. Timeouts stop hung commands. |
| Tooling | Mixed (rome.json, yarn) | Vite+ (`vp`: Vite, Vitest, Oxlint, Oxfmt, caching task runner) on pnpm and Node 24 LTS, and a CI gate on every PR | One toolchain, one linter and formatter, tests run before merge. |

## 4. Migration phases

Each phase has a scope and an exit criterion. A phase is done only when its exit criterion holds in production.

| Phase | Scope | Exit criterion |
|---|---|---|
| 0. Security and CI | Apply the security decisions in section 5. Add a CI gate on every PR. | Rules deployed, CI required on `main`, no open high-severity findings. |
| 1. Toolchain | Move to pnpm, Vite+, Node 24 LTS. | All apps build and test under the new toolchain in CI. |
| 2. Remix to React Router v8 | Port `apps/remix` via codemod in two steps: Remix v2 to React Router v7, then v7 to v8 (requires Node 22.22+, ESM-only). Note that Remix v2 no longer receives security updates. Still reads Firestore. | Site renders identically on Vercel. Visual and route checks pass. |
| 3. Turso and files | Add Turso, Drizzle schema, data migration script, and Cloudflare R2. | Data migrated and verified row by row. Site reads from Turso. Files served from R2. |
| 4. Auth and cleanup | Add Better Auth with passkeys. Remove Firebase Auth, the Cloud Function, and Redis. | Admin login works with passkeys. No Firebase Auth, Function, or Redis calls in code. |
| 5. Playground and CLI | Upgrade `apps/next` to latest Next and React 19. Harden the CLI. | Next app builds in CI. CLI publishes via OIDC with timeouts covered by tests. |
| 6. Decommission Firebase | Export final data, shut down Firebase project resources. | **Needs owner confirmation.** Final backup verified and owner signs off. |

## 5. Security decisions (already made)

- Client writes are denied in Firestore and Storage rules. Writes go through server code only.
- Admin routes require the `EDITOR` or `ADMIN` role.
- Login redirects are restricted to same-origin URLs.
- Anonymous auth is removed.

## 6. Working agreement

- The owner is the final decision maker.
- Small PRs may be auto-merged by the architect.
- Big or production-affecting changes need owner review.
- Every PR runs the CI gate.
