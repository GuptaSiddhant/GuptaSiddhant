import { RemixBrowser } from "@remix-run/react"
import { StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"

global.__IS_SERVER__ = typeof window === "undefined"
global.__IS_DEV__ = process.env.NODE_ENV === "development"

hydrateRoot(
  document,
  <StrictMode>
    <RemixBrowser />
  </StrictMode>,
)
