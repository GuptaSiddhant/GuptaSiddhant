import { bold, cyan } from "ansi-colors";
import { logTable, wrapText } from "./helpers";
const { log } = console;

async function About() {
  const { about } = await import("./database/about.json");
  log(wrapText(about, 50));
}

async function Contact() {
  const { contact } = await import("./database/about.json");
  logTable(
    Object.entries(contact).map(([key, value]) => ({
      key,
      value,
      color: "cyan",
    }))
  );
}

async function Education() {
  const eduFields = ["Degree", "University", "Status"];
  const education = (await import("./database/education.json")).default;
  education.map((e) => {
    logTable(
      Object.entries(e)
        .filter(([key]) => eduFields.includes(key))
        .map(([key, value]) => ({
          key,
          value,
          color: key === "Degree" ? "bold" : "reset",
        }))
    );
  });
  // logTable(
  //   education.map((e) => ({
  //     key: e.title,
  //     value: e.subtitle.replace("\n", " "),
  //   }))
  // );
}

async function Exit() {
  log("  Thank you for using the CLI.");
  process.exit(0);
}

// Export PROMPT CHOICES AND CALLBACKS
export default { About, Education, Contact, Exit } as {
  [choice: string]: () => Promise<void>;
};
// Education: async () => {},
// Experience: async () => {},
// Skills: async () => {},
