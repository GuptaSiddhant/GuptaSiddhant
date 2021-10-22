import React from "react";
import { Newline, Box, Text, TextProps } from "ink";

export function LoadingText(): JSX.Element {
  return (
    <Text dimColor>
      {"Loading..."}
      <Newline />
    </Text>
  );
}

export function ErrorText({ error }: { error?: Error }): JSX.Element {
  return (
    <Text color="red">
      {error?.message || "Data not available. Try again later."}
      <Newline />
    </Text>
  );
}

export function Divider({
  width = 0,
  ...props
}: { width: number } & TextProps): JSX.Element | null {
  const divider = "─";
  if (width < 0) return null;
  return (
    <Box width={"100%"}>
      <Text {...props}>{Array(width).fill(divider).join("")}</Text>
    </Box>
  );
}
