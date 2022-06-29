import { RemixServer } from "@remix-run/react"
import type { EntryContext } from "@remix-run/server-runtime"
import { cert, initializeApp } from "firebase-admin/app"
import { renderToString } from "react-dom/server"

global.__IS_SERVER__ = typeof window === "undefined"
global.__IS_DEV__ = process.env.NODE_ENV === "development"

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "",
)

global.firebaseApp ||
  (global.firebaseApp = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: "https://guptasiddhant-com.firebaseio.com",
    storageBucket: "guptasiddhant-com.appspot.com",
  }))

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
