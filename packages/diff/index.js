// @ts-check

import { spawnSync } from "child_process";

/**
 * @param {string[]} testDirs
 * @param {string[]=} testFiles
 * @param {{ logging?: boolean }=} options
 */
export default function diff(testDirs, testFiles = [], options = {}) {
  const { logging = true } = options;
  const { stdout } = spawnSync(
    ...transformCommand("git diff --name-only HEAD~1 HEAD"),
  );
  const pathList = stdout.split("\n").filter(Boolean);

  if (logging) console.log("Files changed:", pathList);

  pathList.forEach((path) => {
    if (
      testFiles.includes(path) ||
      testDirs.some((dir) => path.includes(dir))
    ) {
      if (logging) console.log("Exit 1, something changed.");

      process.exit(1);
    }
  });

  if (logging) console.log("Exit 0, nothing changed.");

  process.exit(0);
}

// Helpers

/** @typedef {import("child_process").SpawnSyncOptionsWithStringEncoding} SpawnOptions */
/** @type {(command: string) => [string,string[],SpawnOptions ]} */
function transformCommand(command) {
  const [commandName, ...commandArgs] = command.split(" ");
  return [commandName, commandArgs, { encoding: "utf-8" }];
}
