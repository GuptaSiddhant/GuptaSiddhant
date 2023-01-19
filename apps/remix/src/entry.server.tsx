import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "stream";

import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/server-runtime";

import { initFirebase } from "@gs/firebase/init.server";
import { appLogger } from "@gs/service/logger.server";
import { getErrorMessage } from "@gs/utils/error";

global.__IS_SERVER__ = typeof window === "undefined";
global.__IS_DEV__ = process.env.NODE_ENV === "development";
const ABORT_DELAY = 5_000;

initFirebase();

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  appLogger.logRequest(request);

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady: () => {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html; charset=utf-8");
          responseHeaders.set("x-powered-by", "Remix.run");

          if (process.env.NODE_ENV !== "production") {
            responseHeaders.set("Cache-Control", "no-store");
          } else {
            responseHeaders.set("Cache-Control", "3600");
            responseHeaders.set("stale-while-revalidate", "86400");
          }

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(body);
        },

        onShellError: reject,

        onError: (error) => {
          didError = true;

          appLogger.error(getErrorMessage(error));
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

declare global {
  // rome-ignore lint/nursery/noVar: Global declaration
  var __IS_SERVER__: boolean;
  // rome-ignore lint/nursery/noVar: Global declaration
  var __IS_DEV__: boolean;
}
