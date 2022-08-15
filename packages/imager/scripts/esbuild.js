#!/usr/bin/env node
// Script to build CLI with esbuild.

const args = process.argv.slice(2)
const watch = args.includes("watch")

/** @type import("esbuild").BuildOptions */
const buildOptions = {
  entryPoints: ["./src/index.tsx"],
  outfile: "./build/index.js",
  bundle: true,
  platform: "node",
  target: ["node16"],
  external: ["react", "recanvas"],
  inject: ["./scripts/react_shim.js"],
  minify: !watch,
  watch,
  color: true,
  logLevel: "info",
}

require("esbuild")
  .build(buildOptions)
  .catch(() => process.exit(1))
