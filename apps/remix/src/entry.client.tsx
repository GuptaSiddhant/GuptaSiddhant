import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

import { RemixBrowser } from "@remix-run/react";

global.__IS_SERVER__ = typeof window === "undefined";
global.__IS_DEV__ = process.env.NODE_ENV === "development";

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>,
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  window.setTimeout(hydrate, 1);
}

declare global {
  // rome-ignore lint/nursery/noVar: Global declaration
  var __IS_SERVER__: boolean;
  // rome-ignore lint/nursery/noVar: Global declaration
  var __IS_DEV__: boolean;
}
