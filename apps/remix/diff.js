#! /usr/bin/env node
// @ts-check
import { createRequire } from "node:module";

// Used by the Vercel "Ignored Build Step" (exit 1 = build, exit 0 = skip).
createRequire(import.meta.url)("../../scripts/diff")(["apps/remix"]);
