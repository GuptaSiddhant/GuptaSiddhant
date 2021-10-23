#!/usr/bin/env node
// Script to build CLI with esbuild.

const args = process.argv.slice(2);
const watch = args.includes("watch");
const banner = `
// GuptaSiddhant Interactive Resume CLI.
// © Copyright 2021 Siddhant Gupta.
`;

/** @type import("esbuild").BuildOptions */
const buildOptions = {
  entryPoints: ["src/index.tsx"],
  outfile: "bin/index.js",
  bundle: true,
  platform: "node",
  target: ["node12"],
  external: ["react", "ink", "readline", "axios", "open", "ink-*"],
  inject: ["scripts/react_shim.js"],
  banner: { js: banner },
  minify: !watch,
  watch,
  color: true,
  logLevel: watch ? "debug" : "info",
};

require("esbuild")
  .build(buildOptions)
  // .then((res) => console.log(res))
  .catch(() => process.exit(1));
