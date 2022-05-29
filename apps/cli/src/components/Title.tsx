import { Box, Text, Newline } from "ink";
import { useCurrentRoute } from "../routes";
import { PADDING_X } from "../helpers/constants";

export default function Title() {
  const { title } = useCurrentRoute();

  return (
    <Box paddingX={PADDING_X}>
      <Text bold underline>
        {title.toUpperCase()}
        <Newline />
      </Text>
    </Box>
  );
}
