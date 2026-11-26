import { readFileSync } from "node:fs";

import type {
  SourceData,
  SourceDoc,
} from "../../packages/db/src/migrate/index.ts";

export const COLLECTIONS = [
  "projects",
  "blog",
  "career",
  "education",
  "testimonies",
  "users",
  "about",
] as const;

export const STORAGE_BUCKET =
  process.env.FIREBASE_STORAGE_BUCKET || "guptasiddhant-com.appspot.com";

/**
 * Initialises firebase-admin from FIREBASE_SERVICE_ACCOUNT_KEY (JSON string)
 * or GOOGLE_APPLICATION_CREDENTIALS (path to a key file). Imported lazily so
 * `--from-backup` runs need no Firebase packages or credentials.
 */
export async function initFirebase() {
  const { cert, applicationDefault, getApps, initializeApp } =
    await import("firebase-admin/app");
  if (getApps().length) return getApps()[0]!;

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!json && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error(
      "Set FIREBASE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS (or use --from-backup).",
    );
  }
  return initializeApp({
    credential: json ? cert(JSON.parse(json)) : applicationDefault(),
    storageBucket: STORAGE_BUCKET,
  });
}

/** Reads all migrated collections from live Firestore (read-only). */
export async function readFirestore(): Promise<SourceData> {
  await initFirebase();
  const { getFirestore } = await import("firebase-admin/firestore");
  const firestore = getFirestore();

  const data: SourceData = {};
  for (const name of COLLECTIONS) {
    const snapshot = await firestore.collection(name).get();
    data[name] = snapshot.docs.map(
      (doc) => ({ ...serialize(doc.data()), id: doc.id }) as SourceDoc,
    );
  }
  return data;
}

/** Firestore Timestamps -> ISO strings, recursively (like db-backup.js). */
function serialize(value: unknown): any {
  if (Array.isArray(value)) return value.map(serialize);
  if (value && typeof value === "object") {
    if (typeof (value as any).toDate === "function") {
      return (value as any).toDate().toISOString();
    }
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, serialize(v)]),
    );
  }
  return value;
}

export function readBackup(path: string): SourceData {
  return JSON.parse(readFileSync(path, "utf8"));
}
