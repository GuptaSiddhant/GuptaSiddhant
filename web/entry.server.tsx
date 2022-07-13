import { initFirebase } from "@gs/firebase/init"
import { RemixServer } from "@remix-run/react"
import type { EntryContext } from "@remix-run/server-runtime"
import { renderToString } from "react-dom/server"

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
  var __IS_SERVER__: boolean
  var __IS_DEV__: boolean
}
