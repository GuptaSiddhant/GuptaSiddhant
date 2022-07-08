import { RemixServer } from "@remix-run/react"
import type { EntryContext } from "@remix-run/server-runtime"
import { type App, cert, initializeApp } from "firebase-admin/app"
import { type Firestore, getFirestore } from "firebase-admin/firestore"
import { renderToString } from "react-dom/server"
import invariant from "tiny-invariant"

global.__IS_SERVER__ = typeof window === "undefined"
global.__IS_DEV__ = process.env.NODE_ENV === "development"

initFirebase()

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />,
  )

  responseHeaders.set("Content-Type", "text/html")
  responseHeaders.set("X-Powered-By", "Remix-Run")

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}

declare global {
  var firebaseApp: App
  var firestore: Firestore
  var __IS_SERVER__: boolean
  var __IS_DEV__: boolean
}

function initFirebase() {
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
