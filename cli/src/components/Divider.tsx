import { Box, Text, TextProps } from "ink";
import useBoxWidth from "../helpers/useBoxWidth";

export default function Divider(props: TextProps): JSX.Element | null {
  const { ref, width } = useBoxWidth();
  const divider = "─";

  return (
    <Box width={"100%"} ref={ref}>
      <Text {...props}>{Array(width).fill(divider).join("")}</Text>
    </Box>
  );
}
