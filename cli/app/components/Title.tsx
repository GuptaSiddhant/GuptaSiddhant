import React from "react";
import { Newline, Text } from "ink";

export default function Title({ children }: { children: string }): JSX.Element {
  return (
    <Text color="cyan" bold>
      {children.toUpperCase()}
      <Newline />
    </Text>
  );
}
