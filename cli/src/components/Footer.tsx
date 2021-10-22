import React from "react";
import open from "open";
import { Text, Box, useInput, useApp } from "ink";

export default function Footer() {
  const shortcuts = useShortcuts();

  return (
    <Box width="100%" justifyContent="space-between">
      {shortcuts.map(({ key, label }) => (
        <Text key={key} dimColor>
          [{key}] {label}
        </Text>
      ))}
      <Text dimColor>[x] Exit</Text>
    </Box>
  );
}

function useShortcuts() {
  const shortcuts: Array<{ key: string; label: string; url?: string }> = [
    { key: "w", label: "Website", url: "https://guptasiddhant.com" },
    { key: "g", label: "GitHub", url: "https://github.com/guptasiddhant" },
    {
      key: "l",
      label: "LinkedIn",
      url: "https://linkedin.com/in/guptasiddhant9",
    },
    { key: "e", label: "E-mail", url: "mailto:me@guptasiddhant.com" },
  ];

  const { exit } = useApp();

  useInput((input) => {
    if (input === "x" || input === "X") exit();
    shortcuts.forEach(({ key, url }) => {
      if ([key.toLowerCase(), key.toUpperCase()].includes(input)) {
        if (url) return open(url);
      }
    });
  });

  return shortcuts;
}
