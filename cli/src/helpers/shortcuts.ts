import open from "open";
import { useInput, useApp } from "../ink";
import { contacts } from "./contacts";

export const shortcuts: Array<{ key: string; label: string; url?: string }> = [
  ...contacts,
  { key: "x", label: "Exit" },
];

export function useShortcuts() {
  const { exit } = useApp();

  useInput((input) => {
    if (input === "x" || input === "X") {
      exit();
      console.clear();
      console.clear();
    } else {
      shortcuts.forEach(({ key, url }) => {
        if ([key.toLowerCase(), key.toUpperCase()].includes(input)) {
          if (url) return open(url);
        }
      });
    }
  });
}
