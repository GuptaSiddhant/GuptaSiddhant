import { initializeApp } from "firebase-admin/app"
import { getFirestore, Timestamp } from "firebase-admin/firestore"

initializeApp()
const db = getFirestore()
db.settings({ ignoreUndefinedProperties: true })

export { db }

export * from "firebase-admin/firestore"

export function transformFirestoreTimestampToFormattedDate(
  date: Timestamp | string | undefined,
): string | undefined {
  if (!date) return undefined
  const jsDate = typeof date === "string" ? new Date(date) : date.toDate()

  return jsDate.toISOString()
}
