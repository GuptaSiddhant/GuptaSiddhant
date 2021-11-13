import { Box, Text } from "ink";
import { shortcuts } from "../helpers/shortcuts";
import { PADDING_X } from "../helpers/constants";

export default function Footer(): JSX.Element {
  return (
    <Box justifyContent="space-between" paddingX={PADDING_X}>
      {shortcuts.map(({ key, label }) => (
        <Box key={key}>
          <Text color="cyanBright">{key.toUpperCase()}</Text>
          <Text dimColor>: {label}</Text>
        </Box>
      ))}
    </Box>
  );
}
