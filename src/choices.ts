import { blue } from "ansi-colors";
import { logTable, wrapText } from "./helpers";
import aboutJson from "./database/about.json";
const { log } = console;

async function About() {
  log(wrapText(aboutJson.about, 50));
}

async function Contact() {
  logTable(
    Object.entries(aboutJson.contact).map(([key, value]) => ({
      key,
      value: blue(value),
    }))
  );
}

async function Exit() {
  log("  Thank you for using the CLI.");
  process.exit(0);
}

// Export PROMPT CHOICES AND CALLBACKS
export default { About, Contact, Exit } as {
  [choice: string]: () => Promise<void>;
};
// Education: async () => {},
// Experience: async () => {},
// Skills: async () => {},
