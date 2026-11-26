/**
 * The Firestore `index` collection is a denormalised per-collection summary
 * maintained by apps/functions (update-index.ts). With SQL it is derived from
 * the source tables instead, so it can never go stale and needs no trigger.
 * `toIndexItem` mirrors `transformFirestoreDataToIndexItem`.
 */
import { desc } from "drizzle-orm";

import type { Db } from "./client.ts";
import * as schema from "./schema.ts";

export type IndexModel = "projects" | "blog" | "education" | "career";

export interface IndexItem {
  id: string;
  title: string;
  model: IndexModel;
  linkUrl: string;
  subtitle?: string;
  description?: string;
  /** ISO string */
  date?: string;
  icon?: string;
  cover?: string;
  tags: string[];
  links: schema.DbLink[];
  duration?: string;
  association: string;
  draft: boolean;
  featured: boolean;
}

type Row =
  | typeof schema.projects.$inferSelect
  | typeof schema.blog.$inferSelect
  | typeof schema.career.$inferSelect
  | typeof schema.education.$inferSelect;

const orUndef = <T>(v: T | null | undefined): T | undefined => v ?? undefined;

export function toIndexItem(model: IndexModel, row: Row): IndexItem {
  const r = row as Record<string, any>;
  const start: Date | null | undefined = r.dateStart ?? r.startDate;
  const end: Date | null | undefined = r.dateEnd ?? r.endDate;

  const title =
    model === "education"
      ? [r.degree, r.field].filter(Boolean).join(" - ")
      : model === "career"
        ? r.position
        : r.title;
  const subtitle =
    model === "education"
      ? [r.school, r.location].filter(Boolean).join(", ")
      : model === "career"
        ? [r.company, r.location].filter(Boolean).join(", ")
        : r.subtitle;
  const date = r.date ?? start ?? end;

  return {
    id: row.id,
    title,
    model,
    linkUrl: `/${model}/${row.id}/`,
    subtitle: orUndef(subtitle) || undefined,
    description: orUndef(row.description),
    date: date ? date.toISOString() : undefined,
    icon: orUndef(row.icon),
    cover: row.cover ?? row.gallery[0]?.url ?? undefined,
    tags: row.tags,
    links: row.links,
    duration: start ? formatDuration(start, end) : undefined,
    association: row.association ?? "",
    draft: row.draft,
    featured: row.featured,
  };
}

const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatDuration(start: Date, end?: Date | null) {
  return `${monthYear.format(start)} - ${end ? monthYear.format(end) : "Present"}`;
}

/** Index items of one collection, newest first. */
export async function queryIndex(
  db: Db,
  model: IndexModel,
  { includeDrafts = false }: { includeDrafts?: boolean } = {},
): Promise<IndexItem[]> {
  let rows: Row[];
  switch (model) {
    case "projects":
      rows = await db
        .select()
        .from(schema.projects)
        .orderBy(desc(schema.projects.dateStart));
      break;
    case "blog":
      rows = await db
        .select()
        .from(schema.blog)
        .orderBy(desc(schema.blog.date));
      break;
    case "career":
      rows = await db
        .select()
        .from(schema.career)
        .orderBy(desc(schema.career.startDate));
      break;
    case "education":
      rows = await db
        .select()
        .from(schema.education)
        .orderBy(desc(schema.education.startDate));
      break;
  }
  return rows
    .map((row) => toIndexItem(model, row))
    .filter((item) => includeDrafts || !item.draft);
}
