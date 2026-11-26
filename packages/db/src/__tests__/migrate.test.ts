import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";

import { createDb, migrateDb, queryIndex, schema, type Db } from "../index.ts";
import {
  importData,
  readBackupFile,
  toDate,
  transformFirestoreData,
} from "../migrate/index.ts";

const repoRoot = new URL("../../../../", import.meta.url).pathname;
const backupPath = join(repoRoot, "backup/backup.json");

let dir: string;
let db: Db;

beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), "gs-db-"));
  db = createDb({ url: `file:${join(dir, "test.db")}` });
  await migrateDb(db);
});

afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("toDate", () => {
  it("handles ISO strings and Firestore timestamp shapes", () => {
    const iso = "2019-01-01T00:00:00.000Z";
    expect(toDate(iso)?.toISOString()).toBe(iso);
    expect(
      toDate({ _seconds: 1495065600, _nanoseconds: 0 })?.toISOString(),
    ).toBe("2017-05-18T00:00:00.000Z");
    expect(toDate({ seconds: 1495065600, nanoseconds: 0 })?.getTime()).toBe(
      1495065600000,
    );
    expect(toDate({ toDate: () => new Date(5) })?.getTime()).toBe(5);
    expect(toDate(null)).toBeUndefined();
    expect(toDate("not a date")).toBeUndefined();
  });
});

describe("backup -> transform -> libSQL", () => {
  it("transforms the backup and reports odd data as warnings", async () => {
    const { data, warnings } = transformFirestoreData(
      await readBackupFile(backupPath),
    );
    expect(data.projects).toHaveLength(14);
    expect(data.aboutInfo.map((r) => r.id)).toEqual(["info"]);
    expect(warnings.some((w) => w.includes("about/blog"))).toBe(true);
  });

  it("imports with the expected counts and is idempotent", async () => {
    const { data } = transformFirestoreData(await readBackupFile(backupPath));

    const first = await importData(db, data);
    const counts = Object.fromEntries(
      first.map((r) => [r.collection, r.total]),
    );
    expect(counts).toEqual({
      projects: 14,
      blog: 1,
      career: 9,
      education: 5,
      testimonies: 5,
      users: 0,
      "about/info": 1,
      "about/skills": 1,
    });
    expect(first.every((r) => r.updated === 0)).toBe(true);

    const second = await importData(db, data);
    expect(second.every((r) => r.inserted === 0 && r.updated === r.total)).toBe(
      true,
    );
    expect(await db.select().from(schema.projects)).toHaveLength(14);
    expect(await db.select().from(schema.career)).toHaveLength(9);
  });

  it("round-trips dates, nested gallery/links/tags and flags", async () => {
    const [arcadia] = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.id, "arcadia"));
    expect(arcadia!.dateStart).toEqual(new Date("2019-01-01T00:00:00.000Z"));
    expect(arcadia!.dateEnd).toEqual(new Date("2019-02-28T00:00:00.000Z"));
    expect(arcadia!.gallery).toEqual([
      { url: "/arcadia/arcadia-cover.jpg", alt: "Arcadia store" },
    ]);
    expect(arcadia!.links[1]).toEqual({
      url: "https://github.com/GuptaSiddhant/arcadia",
      type: "github",
    });
    expect(arcadia!.tags).toContain("django");
    expect(arcadia!.draft).toBe(false);
    expect(arcadia!.featured).toBe(false);

    const [post] = await db.select().from(schema.blog);
    expect(post!.id).toBe("passport-concept");
    expect(post!.date).toEqual(new Date("2017-05-18T00:00:00.000Z"));
    expect(post!.featured).toBe(true);
    expect(post!.association).toBeNull();

    const [kalpik] = await db
      .select()
      .from(schema.career)
      .where(eq(schema.career.id, "kalpik-studio"));
    // legacy values are kept, not dropped
    expect(kalpik!.type).toBe("self-employed");
    expect(kalpik!.roleType).toBe("freelancer");

    const [accenture] = await db
      .select()
      .from(schema.career)
      .where(eq(schema.career.id, "accenture"));
    expect(accenture!.startDate).toEqual(new Date("2021-09-01T00:00:00.000Z"));
    expect(accenture!.endDate).toBeNull();

    const [info] = await db.select().from(schema.aboutInfo);
    expect(info!.link?.github).toBe("https://github.com/guptasiddhant");
    expect(info!.terminalResume?.copyText).toBe("npx guptasiddhant");
    const [skills] = await db.select().from(schema.aboutSkills);
    expect(skills!.language?.map((s) => s.title)).toContain("Finnish");
  });

  it("updates changed rows on re-import", async () => {
    const source = await readBackupFile(backupPath);
    source.blog![0]!.title = "Renamed";
    const { data } = transformFirestoreData(source);
    const result = await importData(db, data);
    expect(result.find((r) => r.collection === "blog")?.updated).toBe(1);
    const [post] = await db.select().from(schema.blog);
    expect(post!.title).toBe("Renamed");
  });

  it("derives the index (replacing the Firestore `index` collection)", async () => {
    const projects = await queryIndex(db, "projects", { includeDrafts: true });
    expect(projects).toHaveLength(14);
    const dates = projects.map((p) => p.date!);
    expect(dates).toEqual([...dates].sort().reverse());
    const arcadia = projects.find((p) => p.id === "arcadia")!;
    expect(arcadia.linkUrl).toBe("/projects/arcadia/");
    expect(arcadia.duration).toBe("January 2019 - February 2019");
    expect(arcadia.cover).toBe("/arcadia/arcadia-cover.jpg");

    const career = await queryIndex(db, "career", { includeDrafts: true });
    expect(career.find((c) => c.id === "accenture")).toMatchObject({
      title: "Frontend Developer Associate Manager",
      subtitle: "Accenture Nordics, Helsinki, Finland",
      duration: "September 2021 - Present",
    });
  });

  it("rejects documents missing required fields", () => {
    expect(() =>
      transformFirestoreData({ blog: [{ id: "x", title: "No date" }] }),
    ).toThrow(/blog\/x: required field "date"/);
  });
});

describe("migration CLI", () => {
  const script = join(repoRoot, "scripts/migrate-firestore-to-turso/index.ts");

  it("migrates a backup into a file: database, twice", () => {
    const url = `file:${join(dir, "cli.db")}`;
    const run = () =>
      spawnSync(process.execPath, [script, "--from-backup", backupPath], {
        env: { ...process.env, TURSO_DATABASE_URL: url },
        encoding: "utf8",
      });
    const first = run();
    expect(first.status, first.stderr).toBe(0);
    expect(first.stdout).toContain("Upserted 36 rows");
    const second = run();
    expect(second.status, second.stderr).toBe(0);
    expect(second.stdout).toMatch(/projects\s+projects\s+14\s+0\s+14/);
  });

  it("--dry-run needs no database", () => {
    const res = spawnSync(
      process.execPath,
      [script, "--from-backup", backupPath, "--dry-run"],
      { env: { ...process.env, TURSO_DATABASE_URL: "" }, encoding: "utf8" },
    );
    expect(res.status, res.stderr).toBe(0);
    expect(res.stdout).toContain("Would upsert 36 rows");
  });
});
