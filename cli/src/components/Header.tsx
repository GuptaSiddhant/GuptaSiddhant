import React from "react";
import { Text, Box, Newline } from "ink";

const name = "Siddhant Gupta";
const title = "Frontend and UI Developer";

export default function Header() {
  const formattedName = name.split("").join(" ").toUpperCase();

  return (
    <Box width="100%" marginBottom={1} justifyContent="space-between">
      <Text>
        <Text color="green" bold>
          {formattedName}
        </Text>
        <Newline />
        <Text color="yellow">{title}</Text>
      </Text>

      <Text>
        <Text dimColor>Full portfolio at:</Text>
        <Newline />
        <Text>https://guptasiddhant.com</Text>
      </Text>
    </Box>
  );
}
