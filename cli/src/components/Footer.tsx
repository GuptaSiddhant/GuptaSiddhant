import { Box, Text } from "../ink";
import { shortcuts } from "../helpers/shortcuts";

export default function Footer() {
  return (
    <Box width="100%" justifyContent="space-between">
      {shortcuts.map(({ key, label }) => (
        <Box key={key}>
          <Text dimColor>[</Text>
          <Text color="cyanBright">{key}</Text>
          <Text dimColor>] {label}</Text>
        </Box>
      ))}
    </Box>
  );
}
