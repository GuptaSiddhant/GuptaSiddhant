/**
 * Pure transformation: Firestore documents (live, or from a backup JSON file)
 * -> rows for the Drizzle tables. No I/O so it is trivially testable.
 */
import {
  skillCategories,
  type aboutInfo,
  type aboutSkills,
  type blog,
  type career,
  type education,
  type projects,
  type testimonies,
  type users,
  userRoles,
} from "../schema.ts";

export type SourceDoc = Record<string, unknown> & { id: string };
/** Collection name -> documents. `info` is accepted as an alias of `about`. */
export type SourceData = Record<string, SourceDoc[]>;

export interface MigrationData {
  projects: (typeof projects.$inferInsert)[];
  blog: (typeof blog.$inferInsert)[];
  career: (typeof career.$inferInsert)[];
  education: (typeof education.$inferInsert)[];
  testimonies: (typeof testimonies.$inferInsert)[];
  users: (typeof users.$inferInsert)[];
  aboutInfo: (typeof aboutInfo.$inferInsert)[];
  aboutSkills: (typeof aboutSkills.$inferInsert)[];
}

export interface TransformResult {
  data: MigrationData;
  /** Non-fatal oddities (ignored fields, dropped legacy docs, ...). */
  warnings: string[];
}

type Raw = Record<string, unknown>;

// Value coercion

/**
 * Accepts ISO strings, epoch ms, Date, Firestore `Timestamp` instances and
 * their JSON forms (`{_seconds,_nanoseconds}` / `{seconds,nanoseconds}`).
 */
export function toDate(value: unknown): Date | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  let date: Date;
  if (value instanceof Date) date = value;
  else if (typeof value === "string") date = new Date(value);
  else if (typeof value === "number") date = new Date(value);
  else if (typeof value === "object") {
    const v = value as Raw;
    if (typeof v.toDate === "function") date = (v as any).toDate();
    else {
      const seconds = v._seconds ?? v.seconds;
      if (typeof seconds !== "number") return undefined;
      const nanos = v._nanoseconds ?? v.nanoseconds;
      date = new Date(
        seconds * 1000 +
          Math.floor((typeof nanos === "number" ? nanos : 0) / 1e6),
      );
    }
  } else return undefined;
  return Number.isNaN(date.getTime()) ? undefined : date;
}

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v !== "" ? v : undefined;

const strOrNull = (v: unknown): string | null => str(v) ?? null;

const bool = (v: unknown, fallback = false): boolean =>
  typeof v === "boolean" ? v : fallback;

const arr = <T = unknown>(v: unknown): T[] => (Array.isArray(v) ? v : []);

const strArr = (v: unknown): string[] =>
  arr(v).filter((t): t is string => typeof t === "string");

const objArr = <T>(v: unknown): T[] =>
  arr(v).filter(
    (t): t is T => typeof t === "object" && t !== null && !Array.isArray(t),
  );

const obj = <T>(v: unknown): T | null =>
  typeof v === "object" && v !== null && !Array.isArray(v) ? (v as T) : null;

function required<T>(
  collection: string,
  id: string,
  field: string,
  value: T | undefined,
): T {
  if (value === undefined) {
    throw new Error(
      `${collection}/${id}: required field "${field}" is missing`,
    );
  }
  return value;
}

// Per-collection transforms

function summary(doc: Raw, id: string) {
  return {
    id,
    subtitle: strOrNull(doc.subtitle),
    description: strOrNull(doc.description),
    content: strOrNull(doc.content),
    icon: strOrNull(doc.icon),
    cover: strOrNull(doc.cover),
    association: strOrNull(doc.association),
    tags: strArr(doc.tags),
    links: objArr<any>(doc.links),
    gallery: objArr<any>(doc.gallery),
    draft: bool(doc.draft),
    featured: bool(doc.featured),
  };
}

const SUMMARY_KEYS = [
  "id",
  "subtitle",
  "description",
  "content",
  "icon",
  "cover",
  "association",
  "tags",
  "links",
  "gallery",
  "draft",
  "featured",
];

const KNOWN_KEYS: Record<string, string[]> = {
  projects: [...SUMMARY_KEYS, "title", "dateStart", "dateEnd"],
  blog: [...SUMMARY_KEYS, "title", "date"],
  career: [
    ...SUMMARY_KEYS,
    "position",
    "company",
    "type",
    "roleType",
    "location",
    "startDate",
    "endDate",
  ],
  education: [
    ...SUMMARY_KEYS,
    "degree",
    "field",
    "school",
    "location",
    "startDate",
    "endDate",
  ],
  testimonies: [
    "id",
    "title",
    "subtitle",
    "content",
    "association",
    "link",
    "date",
    "draft",
  ],
  users: ["id", "name", "email", "role"],
  about_info: [
    "id",
    "name",
    "shortName",
    "title",
    "currentCompany",
    "techStack",
    "heroAdjectives",
    "hero",
    "terminalResume",
    "link",
    "bio",
  ],
  about_skills: ["id", ...skillCategories],
};

export function transformFirestoreData(source: SourceData): TransformResult {
  const warnings: string[] = [];
  const docs = (name: string): SourceDoc[] => source[name] ?? [];

  const checkUnknown = (collection: string, doc: Raw) => {
    const known = KNOWN_KEYS[collection] ?? [];
    const unknown = Object.keys(doc).filter((k) => !known.includes(k));
    if (unknown.length) {
      warnings.push(
        `${collection}/${doc.id}: ignored unknown fields: ${unknown.join(", ")}`,
      );
    }
  };

  const each = <T>(
    collection: string,
    fn: (doc: SourceDoc, id: string) => T,
    list: SourceDoc[] = docs(collection),
  ): T[] =>
    list.map((doc) => {
      const id = str(doc.id);
      if (!id) throw new Error(`${collection}: document without "id"`);
      checkUnknown(collection, doc);
      return fn(doc, id);
    });

  const data: MigrationData = {
    projects: each("projects", (d, id) => ({
      ...summary(d, id),
      title: required("projects", id, "title", str(d.title)),
      dateStart: required("projects", id, "dateStart", toDate(d.dateStart)),
      dateEnd: toDate(d.dateEnd) ?? null,
    })),

    blog: each("blog", (d, id) => ({
      ...summary(d, id),
      title: required("blog", id, "title", str(d.title)),
      date: required("blog", id, "date", toDate(d.date)),
    })),

    career: each("career", (d, id) => ({
      ...summary(d, id),
      position: required("career", id, "position", str(d.position)),
      company: required("career", id, "company", str(d.company)),
      type: strOrNull(d.type),
      roleType: strOrNull(d.roleType),
      location: strOrNull(d.location),
      startDate: required("career", id, "startDate", toDate(d.startDate)),
      endDate: toDate(d.endDate) ?? null,
    })),

    education: each("education", (d, id) => ({
      ...summary(d, id),
      degree: required("education", id, "degree", str(d.degree)),
      field: required("education", id, "field", str(d.field)),
      school: required("education", id, "school", str(d.school)),
      location: strOrNull(d.location),
      startDate: required("education", id, "startDate", toDate(d.startDate)),
      endDate: toDate(d.endDate) ?? null,
    })),

    testimonies: each("testimonies", (d, id) => ({
      id,
      title: required("testimonies", id, "title", str(d.title)),
      subtitle: strOrNull(d.subtitle),
      content: required("testimonies", id, "content", str(d.content)),
      association: strOrNull(d.association),
      link: strOrNull(d.link),
      date: toDate(d.date) ?? null,
      draft: bool(d.draft),
    })),

    users: each("users", (d, id) => {
      const role = str(d.role);
      const validRole = (userRoles as readonly string[]).includes(role ?? "");
      if (role && !validRole) {
        warnings.push(`users/${id}: unknown role "${role}", using GUEST`);
      }
      return {
        id,
        name: required("users", id, "name", str(d.name)),
        email: required("users", id, "email", str(d.email)),
        role: validRole ? (role as (typeof userRoles)[number]) : "GUEST",
      };
    }),

    aboutInfo: [],
    aboutSkills: [],
  };

  // `about` collection (docs "info" and "skills"). Older backups call the
  // collection `info`, use the doc id "about" for the info doc and also hold
  // legacy per-collection maps ("blog", "projects") that are not documents.
  const aboutDocs = [...docs("about"), ...docs("info")];
  const infoDocs: SourceDoc[] = [];
  const skillsDocs: SourceDoc[] = [];
  for (const doc of aboutDocs) {
    if (doc.id === "info" || doc.id === "about") infoDocs.push(doc);
    else if (doc.id === "skills") skillsDocs.push(doc);
    else {
      warnings.push(
        `about/${doc.id}: legacy document skipped (only "info" and "skills" are migrated)`,
      );
    }
  }

  data.aboutInfo = each(
    "about_info",
    (d) => ({
      id: "info",
      name: required("about", "info", "name", str(d.name)),
      shortName: required("about", "info", "shortName", str(d.shortName)),
      title: required("about", "info", "title", str(d.title)),
      currentCompany: (obj(d.currentCompany) ?? str(d.currentCompany)) as any,
      techStack: d.techStack === undefined ? null : strArr(d.techStack),
      heroAdjectives:
        d.heroAdjectives === undefined ? null : strArr(d.heroAdjectives),
      hero: obj(d.hero),
      terminalResume: obj(d.terminalResume),
      link: obj(d.link),
      bio: strOrNull(d.bio),
    }),
    infoDocs,
  );

  data.aboutSkills = each(
    "about_skills",
    (d) => {
      const row: Raw = { id: "skills" };
      for (const category of skillCategories) {
        row[category] = d[category] === undefined ? null : objArr(d[category]);
      }
      return row as unknown as MigrationData["aboutSkills"][number];
    },
    skillsDocs,
  );

  if (data.aboutInfo.length > 1) {
    warnings.push(
      `about: ${data.aboutInfo.length} info documents found; the last one wins`,
    );
    data.aboutInfo = data.aboutInfo.slice(-1);
  }

  return { data, warnings };
}
