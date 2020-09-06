#!/usr/bin/env node

import { bold, cyan, green, yellow } from "ansi-colors";
import { prompt } from "enquirer";
import choices from "./choices";
const { log, clear } = console;

async function header() {
  clear();
  clear();
  const { name, title } = await import("./database/about.json");
  const heading = name.split("").join(" ").toUpperCase();
  const makeLine = (length = 2, char = " ") =>
    Array(length).fill(char).join("");
  const separator = makeLine(heading.length + 2, "─");
  const spacing = makeLine((heading.length - title.length - 2) / 2);
  log(`╭${separator}╮`);
  log("│", green.bold(heading), "│");
  log("│", spacing, yellow(title), spacing, "│");
  log(`╰${separator}╯`);
}

const menuMessages: string[] = [
  "What would you like to know?",
  "Where to next?",
  "What's next?",
  "Wanna continue with",
];

// Function to handle prompts
export async function inquirer(firstTime?: boolean): Promise<void> {
  // Log welcome message
  if (firstTime) {
    // Clean slate and render header
    await header();
    log("  Welcome to my CLI resume.\n  Feel free to roam around.");
  } else log("");

  // Get firstTime or random message/question
  const message = firstTime
    ? "Where to begin?"
    : menuMessages[Math.floor(Math.random() * menuMessages.length)];

  // Render prompt menu
  const response = await prompt([
    {
      type: "select",
      name: "option",
      message,
      choices: Object.keys(choices),
    },
  ]);
  // ------------------
  // Clean slate and render header
  await header();
  // Get choice
  const { option } = response as {
    option: string;
  };
  // Print Choice
  log(cyan("•"), bold(option.toUpperCase()));
  // Find matching Choice
  const match = Object.entries(choices).find(([choice]) => choice === option);
  // Execute choice callback
  match && (await match[1]());
  // Recurse till Exit
  await inquirer();
}

function exitErrorCallback() {
  clear();
  log(bold("Siddhant Gupta's Resume"));
  log("Thank you for using the CLI.");
  log("`npx guptasiddhant`");
}

// Entry point - AsyncIIFE
(async (): Promise<void> => {
  // Handle exit with error
  process.on("exit", (code) => code > 0 && exitErrorCallback());
  // firstTime inquiring
  inquirer(true);
})();
