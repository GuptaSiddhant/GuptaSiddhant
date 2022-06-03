import type { EntryContext } from "@remix-run/server-runtime"
import { RemixServer } from "@remix-run/react"
import { renderToString } from "react-dom/server"
import { initializeApp, applicationDefault } from "firebase-admin/app"

global.firebaseApp ||
  (global.firebaseApp = initializeApp({
    credential: applicationDefault(),
    databaseURL: "https://guptasiddhant-com.firebaseio.com",
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
