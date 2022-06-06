import type { EntryContext } from "@remix-run/server-runtime"
import { RemixServer } from "@remix-run/react"
import { renderToString } from "react-dom/server"
import { initializeApp, cert } from "firebase-admin/app"

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

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
