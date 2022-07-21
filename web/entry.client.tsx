import { StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"

import { RemixBrowser } from "@remix-run/react"

global.__IS_SERVER__ = typeof window === "undefined"
global.__IS_DEV__ = process.env.NODE_ENV === "development"

hydrateRoot(
  document,
  <StrictMode>
    <RemixBrowser />
  </StrictMode>,
)

declare global {
  var __IS_SERVER__: boolean
  var __IS_DEV__: boolean
}
