import { Box, Text, type TextProps } from "ink";

import useWindowSize from "../helpers/useWindowSize";

export default function Divider(props: TextProps): JSX.Element | null {
  const { width } = useWindowSize();
  const divider = "─";

  return (
    <Box>
      <Text {...props}>
        {width > 5
          ? Array(width - 2)
              .fill(divider)
              .join("")
          : ""}
      </Text>
    </Box>
  );
}
