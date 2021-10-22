import { green, yellow } from "ansi-colors";
const { log, clear } = console;

export default async function Header() {
  clear();
  clear();

  const { name, title } = {
    name: "Siddhant Gupta",
    title: "Fronted and UI Developer",
  };
  const heading = name.split("").join(" ").toUpperCase();
  const makeLine = (length = 2, char = " ") =>
    Array(length).fill(char).join("");
  const separator = makeLine(heading.length + 2, "─");
  const spacing = makeLine((heading.length - title.length - 2) / 2);

  log(`╭${separator}╮`);
  log("│", green.bold(heading), "│");
  log("│", yellow(title), spacing, spacing, "│");
  log(`╰${separator}╯`);
}
