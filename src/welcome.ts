import { green, blue, yellow, dim } from "ansi-colors";
const { log, clear } = console;

const makeLine = (length = 2, char = " ") => Array(length).fill(char).join("");

export const header = async () => {
  clear();
  const { name, title } = await import("./database/about.json");
  const heading = name.split("").join(" ").toUpperCase();
  const separator = makeLine(heading.length + 2, "─");
  const spacing = makeLine((heading.length - title.length - 2) / 2);
  log(`╭${separator}╮`);
  log("│", green.bold(heading), "│");
  log("│", spacing, yellow(title), spacing, "│");
  log(`╰${separator}╯`);
};

export const about = async () => {
  const { github, linkedIn, email } = await import("./database/about.json");
  log(dim("Email:   "), blue(email));
  log(dim("GitHub:  "), blue("https://github.com/" + github));
  log(dim("LinkedIn:"), blue("https://linkedin.com/in/" + linkedIn));
};
