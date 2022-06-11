import { RemixBrowser } from "@remix-run/react"
import { StrictMode } from "react"
import { hydrate } from "react-dom"

global.__IS_SERVER__ = false
global.__IS_DEV__ = process.env.NODE_ENV === "development"

hydrate(
  <StrictMode>
    <RemixBrowser />
  </StrictMode>,
  document,
)
