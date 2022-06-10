import { RemixBrowser } from "@remix-run/react"
import { StrictMode } from "react"
import { hydrate } from "react-dom"

hydrate(
  <StrictMode>
    <RemixBrowser />
  </StrictMode>,
  document,
)
