/**
 * Drizzle schema (SQLite / libSQL dialect) mirroring the Firestore collections.
 *
 * Conventions
 * - Document ids become `id` text primary keys (Firestore ids are slugs).
 * - Dates are integers (`timestamp_ms`, UTC); Drizzle exposes them as `Date`.
 * - Nested arrays/objects (tags, links, gallery, ...) are JSON text columns.
 * - The Firestore `index` collection is NOT stored; see `index-items.ts`.
 */
import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// JSON column shapes (see apps/remix/src/features/types and summary/types.d.ts)

export type LinkType =
  | "homepage"
  | "other"
  | "github"
  | "linkedin"
  | "twitter"
  | "demo"
  | (string & {});

export interface DbLink {
  url: string;
  title?: string;
  type?: LinkType;
}

export interface DbGalleryItem {
  url: string;
  alt?: string;
  credit?: string;
  /** Blurhash data etc.; kept verbatim. */
  metadata?: Record<string, unknown>;
}

export const careerRoleTypes = [
  "full-time",
  "part-time",
  "freelancer",
  "intern",
  "contract",
] as const;
export const userRoles = ["GUEST", "EDITOR", "ADMIN"] as const;
export const skillLevels = ["advanced", "intermediate", "basic"] as const;
export const skillCategories = [
  "soft",
  "frontend",
  "backend",
  "design",
  "language",
  "tooling",
] as const;

export type CareerRoleType = (typeof careerRoleTypes)[number];
export type UserRole = (typeof userRoles)[number];
export type SkillCategory = (typeof skillCategories)[number];

export interface DbSkill {
  title: string;
  linkUrl?: string;
  iconUrl?: string;
  level?: (typeof skillLevels)[number];
}

// Column helpers

const timestamp = (name: string) => integer(name, { mode: "timestamp_ms" });

/** Columns shared by projects, blog, career and education (SummaryItem). */
const summaryColumns = () => ({
  id: text("id").primaryKey(),
  subtitle: text("subtitle"),
  description: text("description"),
  content: text("content"),
  icon: text("icon"),
  cover: text("cover"),
  association: text("association"),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
  links: text("links", { mode: "json" })
    .$type<DbLink[]>()
    .notNull()
    .default([]),
  gallery: text("gallery", { mode: "json" })
    .$type<DbGalleryItem[]>()
    .notNull()
    .default([]),
  draft: integer("draft", { mode: "boolean" }).notNull().default(false),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
});

const skillColumn = (name: string) =>
  text(name, { mode: "json" }).$type<DbSkill[]>();

// Collections

export const projects = sqliteTable(
  "projects",
  {
    ...summaryColumns(),
    title: text("title").notNull(),
    dateStart: timestamp("date_start").notNull(),
    dateEnd: timestamp("date_end"),
  },
  (t) => [
    // firestore.indexes.json: projects (draft ASC, dateStart DESC)
    index("projects_draft_date_start_idx").on(
      t.draft,
      sql`${t.dateStart} desc`,
    ),
  ],
);

export const blog = sqliteTable(
  "blog",
  {
    ...summaryColumns(),
    title: text("title").notNull(),
    date: timestamp("date").notNull(),
  },
  (t) => [
    // firestore.indexes.json: blog (draft ASC, date DESC)
    index("blog_draft_date_idx").on(t.draft, sql`${t.date} desc`),
  ],
);

export const career = sqliteTable("career", {
  ...summaryColumns(),
  position: text("position").notNull(),
  company: text("company").notNull(),
  /** Role type as stored in Firestore (also legacy values, e.g. "self-employed"). */
  type: text("type").$type<CareerRoleType | (string & {})>(),
  /** Newer, normalised role type that some documents carry (CareerRoleType). */
  roleType: text("role_type").$type<CareerRoleType | (string & {})>(),
  location: text("location"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
});

export const education = sqliteTable("education", {
  ...summaryColumns(),
  degree: text("degree").notNull(),
  field: text("field").notNull(),
  school: text("school").notNull(),
  location: text("location"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
});

export const testimonies = sqliteTable("testimonies", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  content: text("content").notNull(),
  association: text("association"),
  link: text("link"),
  date: timestamp("date"),
  draft: integer("draft", { mode: "boolean" }).notNull().default(false),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role", { enum: userRoles }).notNull().default("GUEST"),
});

/** Firestore `about/info` (a single row; `id` is "info"). */
export const aboutInfo = sqliteTable("about_info", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  title: text("title").notNull(),
  currentCompany: text("current_company", { mode: "json" }).$type<
    string | { name?: string; link?: string; hiringLink?: string }
  >(),
  techStack: text("tech_stack", { mode: "json" }).$type<string[]>(),
  heroAdjectives: text("hero_adjectives", { mode: "json" }).$type<string[]>(),
  hero: text("hero", { mode: "json" }).$type<{
    title: string;
    adjectives: string[];
  }>(),
  terminalResume: text("terminal_resume", { mode: "json" }).$type<{
    code: string;
    copyText?: string;
  }>(),
  link: text("link", { mode: "json" }).$type<Record<string, string>>(),
  bio: text("bio"),
});

/** Firestore `about/skills` (a single row; `id` is "skills"). */
export const aboutSkills = sqliteTable("about_skills", {
  id: text("id").primaryKey(),
  soft: skillColumn("soft"),
  frontend: skillColumn("frontend"),
  backend: skillColumn("backend"),
  design: skillColumn("design"),
  language: skillColumn("language"),
  tooling: skillColumn("tooling"),
});
