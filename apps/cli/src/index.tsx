#!/usr/bin/env node

import { render } from "ink"
import { StrictMode } from "react"

import App from "./App"
import { type RoutePath } from "./routes"

const path = process.argv[2] as RoutePath | undefined

console.clear()

render(
  <StrictMode>
    <App path={path} />
  </StrictMode>,
)
