#! /usr/bin/env node
// @ts-check

const { spawnSync } = require("child_process");

const { stdout } = spawnSync(
  ...transformCommand("git diff --name-only HEAD~1 HEAD"),
);
const pathList = stdout.split("\n").filter(Boolean);

console.log("Files changed:", pathList);

const testDirs = ["apps/remix"];
const testFiles = [];

pathList.forEach((path) => {
  if (testFiles.includes(path) || testDirs.some((dir) => path.includes(dir))) {
    console.log("Exit 1");
    process.exit(1);
  }
});

console.log("Exit 0");
process.exit(0);

// Helpers

/** @typedef {import("child_process").SpawnSyncOptionsWithStringEncoding} SpawnOptions */

/** @type {(command: string) => [string,string[],SpawnOptions ]} */
function transformCommand(command) {
  const [commandName, ...commandArgs] = command.split(" ");
  return [commandName, commandArgs, { encoding: "utf-8" }];
}
