import { Box, Text } from "ink";

export default function HelpBox(props: Record<string, string>): JSX.Element {
  return (
    <Box flexDirection="column">
      {Object.entries(props).map(([key, value]) => (
        <Box key={key + value}>
          <Text color="cyan">{key} </Text>
          <Text dimColor>{value}</Text>
        </Box>
      ))}
    </Box>
  );
}
