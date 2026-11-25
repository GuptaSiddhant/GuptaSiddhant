import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

import { HydratedRouter } from "react-router/dom";

global.__IS_SERVER__ = typeof window === "undefined";
global.__IS_DEV__ = process.env.NODE_ENV === "development";

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
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
  // oxlint-disable-next-line no-var -- Global declaration
  var __IS_SERVER__: boolean;
  // oxlint-disable-next-line no-var -- Global declaration
  var __IS_DEV__: boolean;
}
