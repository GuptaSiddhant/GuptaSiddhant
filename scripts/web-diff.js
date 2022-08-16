#! /usr/bin/env node
// @ts-check

const { spawnSync } = require("child_process")

const { stdout } = spawnSync(
  ...transformCommand(`git diff --name-only HEAD~2 HEAD`),
)
const pathList = stdout.split("\n").filter(Boolean)

console.log("Files changed:", pathList)

const testDirs = ["web", "public"]
const testFiles = [
  "package.json",
  ".eslintrc",
  ".prettierrc.js",
  "tsconfig.json",
  "remix.env.d.ts",
  "server.js",
  "tailwind.config.js",
  "vitest.config.js",
]

pathList.forEach((path) => {
  if (testFiles.includes(path) || testDirs.includes(path.split("/")[0]))
    process.exit(1)
})

process.exit(0)

// Helpers

/** @typedef {import("child_process").SpawnSyncOptionsWithStringEncoding} SpawnOptions */

/** @type {(command: string) => [string,string[],SpawnOptions ]} */
function transformCommand(command) {
  const [commandName, ...commandArgs] = command.split(" ")
  return [commandName, commandArgs, { encoding: "utf-8" }]
}
