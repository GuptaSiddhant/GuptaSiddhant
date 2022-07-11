import { Box, Text } from "ink"

import HelpBox from "../components/HelpBox"
import { PADDING_X } from "../helpers/constants"
import { shortcuts } from "../helpers/shortcuts"

export default function Footer(): JSX.Element {
  return (
    <Box paddingX={PADDING_X} flexDirection="column">
      <HelpBox
        {...{ "↔": "Switch between tabs with left/right arrow keys." }}
      />
      <Box justifyContent="space-between">
        {shortcuts.map(({ key, label }) => (
          <Box key={key}>
            <Text color="cyan">{key.toUpperCase()}</Text>
            <Text dimColor> {label}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
