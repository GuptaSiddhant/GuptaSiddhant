import { initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

initializeApp()
const db = getFirestore()
db.settings({ ignoreUndefinedProperties: true })

export { db }

export * from "firebase-admin/firestore"
