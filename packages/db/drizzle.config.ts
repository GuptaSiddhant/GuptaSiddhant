import { defineConfig } from "drizzle-kit";

// `drizzle-kit generate` only needs the schema; `push`/`studio` need a database.
export default defineConfig({
  dialect: "turso",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL ?? "file:./local.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
