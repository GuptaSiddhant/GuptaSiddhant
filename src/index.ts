#!/usr/bin/env node

import { prompt } from "enquirer";
import * as welcome from "./welcome";
const { log, clear } = console;

const menu = async (): Promise<any> => {
  log("");
  const response = await prompt([
    {
      type: "select",
      name: "option",
      message: "What would you like to know?",
      choices: ["about", "education", "experience", "skills", "exit"],
    },
  ]);
  clear();
  await welcome.header();
  return { ...response };
};

const init = async () => {
  const { option } = await menu();
  switch (option) {
    case "about":
      await welcome.about();
      break;
    case "exit":
      process.exit(0);
    default:
      log(option);
  }

  await init();
};

(async () => {
  await welcome.header();
  init();
})();
