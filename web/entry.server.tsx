import { renderToPipeableStream } from "react-dom/server"
import { PassThrough } from "stream"

import { Response } from "@remix-run/node"
import { RemixServer } from "@remix-run/react"
import type { EntryContext } from "@remix-run/server-runtime"

import { initFirebase } from "@gs/firebase/init"

global.__IS_SERVER__ = typeof window === "undefined"
global.__IS_DEV__ = process.env.NODE_ENV === "development"
const ABORT_DELAY = 5_000

initFirebase()

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady: () => {
          const body = new PassThrough()

          responseHeaders.set("Content-Type", "text/html")

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          )

          pipe(body)
        },
        onShellError: (err) => {
          reject(err)
        },
        onError: (error) => {
          didError = true

          console.error(error)
        },
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}

declare global {
  var __IS_SERVER__: boolean
  var __IS_DEV__: boolean
}
