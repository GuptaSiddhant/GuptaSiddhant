import { renderToString } from "react-dom/server"

import { RemixServer } from "@remix-run/react"
import type { EntryContext } from "@remix-run/server-runtime"

import { initFirebase } from "@gs/firebase/init"

global.__IS_SERVER__ = typeof window === "undefined"
global.__IS_DEV__ = process.env.NODE_ENV === "development"

initFirebase()

if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(
    `${process.env.PWD}/node_modules/canvas/build/Release:`,
  )
) {
  process.env.LD_LIBRARY_PATH = `${
    process.env.PWD
  }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ""}`
}

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
