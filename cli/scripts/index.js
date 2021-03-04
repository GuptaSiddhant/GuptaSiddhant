#!/usr/bin/env node
//@ts-check

// Yarn check
if (process.env?.npm_execpath?.indexOf("yarn") === -1)
  throw new Error("You must use Yarn, not NPM");

// Get package.json values from process environment.
const envPackage = Object.entries(process.env)
  .filter(([key]) => key.includes("package"))
  .sort()
  .reduce(
    (acc, [key, val]) => ({ ...acc, [key.split("package_")[1]]: val }),
    {}
  );

const { clear, log } = console;
clear();
clear();
log(envPackage);
