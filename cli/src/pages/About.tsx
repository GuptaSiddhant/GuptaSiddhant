import React from "react";
import { Box, Text } from "ink";

const about = `Ever since I could first remember, I’ve been fascinated by how things work. While it took me some time to discover my zeal for design, I haven’t stopped pursuing it ever since. Started with self-taught graphical design and then advanced on to visual and interface design overtime. With a professional education in hand, I expanded to tackling user/customer experience design. 
I acquainted myself with research, development, business, and management to better understand the implications, communicate well with all parties involved. This also led me to become a better designer in the process.
If I had to describe myself in one word, that’d be STALWART.
`;

export default function About(): JSX.Element {
  return (
    <Box marginBottom={1} marginX={1} flexDirection="column">
      <Text>{about}</Text>
    </Box>
  );
}
