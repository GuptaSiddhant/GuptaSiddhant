import { Box, Newline, Text } from "ink"

import { PADDING_X } from "../helpers/constants"
import { useAboutQuery } from "../helpers/queries"

export default function Header() {
  const { data } = useAboutQuery()
  const { title, name } = data || {}
  const formattedName = name?.split("").join(" ").toUpperCase()

  return (
    <Box marginBottom={1} justifyContent="space-between" paddingX={PADDING_X}>
      <Text>
        <Text color="green" bold>
          {formattedName}
        </Text>
        <Newline />
        <Text color="yellow">{title}</Text>
      </Text>

      <Text>
        <Text dimColor>| More details at:</Text>
        <Newline />
        <Text dimColor>|</Text> https://guptasiddhant.com
      </Text>
    </Box>
  )
}
