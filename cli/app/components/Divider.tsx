import React from "react";
import { Box, Text, TextProps } from "ink";

export default function Divider({
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
