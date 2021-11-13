import open from "open";
import { useInput, useApp } from "ink";
import contacts from "./contacts";

export const shortcuts: Array<{ key: string; label: string; url?: string }> = [
  ...contacts,
  { key: "Esc", label: "Exit" },
];

export function useShortcuts() {
  const { exit } = useApp();

  useInput((input, key) => {
    if (input === "x" || input === "X" || key.escape) {
      exit();
      // console.clear();
      // console.clear();
    } else {
      shortcuts.forEach(({ key, url }) => {
        if ([key.toLowerCase(), key.toUpperCase()].includes(input)) {
          if (url) return open(url);
        }
      });
    }
  });
}
