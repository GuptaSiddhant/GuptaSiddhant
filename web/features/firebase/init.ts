import { type App, cert, initializeApp } from "firebase-admin/app"
import { type Firestore, getFirestore } from "firebase-admin/firestore"
import invariant from "@gs/utils/invariant"

export function initFirebase() {
  const FIREBASE_SERVICE_ACCOUNT_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  invariant(
    FIREBASE_SERVICE_ACCOUNT_KEY,
    "Env FIREBASE_SERVICE_ACCOUNT_KEY is required.",
  )

  const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY)

  global.firebaseApp ||
    (global.firebaseApp = initializeApp({
      credential: cert(serviceAccount),
      databaseURL: "https://guptasiddhant-com.firebaseio.com",
      storageBucket: "guptasiddhant-com.appspot.com",
    }))

  global.firestore || (global.firestore = getFirestore(global.firebaseApp))
  global.firestore || firestore.settings({ ignoreUndefinedProperties: true })
}

declare global {
  var firebaseApp: App
  var firestore: Firestore
}
