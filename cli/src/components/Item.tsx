import { Box, Text, TextProps } from "ink";
import type { PropsWithChildren } from "react";

export function ItemBox({ children }: PropsWithChildren<{}>) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      {children}
    </Box>
  );
}

export function ItemTitle({
  children,
  selected,
}: PropsWithChildren<{ selected?: boolean }>): JSX.Element {
  return (
    <Text color={"green"} bold={selected} dimColor={!selected}>
      {children}
    </Text>
  );
}

export function ItemSubTitle({
  children,
  selected,
}: PropsWithChildren<{ selected?: boolean }>): JSX.Element {
  return (
    <Text color={"yellow"} dimColor={!selected}>
      {children}
    </Text>
  );
}

export function ItemDescription({
  children,
  selected,
  ...rest
}: PropsWithChildren<{ selected?: boolean } & TextProps>): JSX.Element | null {
  return selected ? <Text {...rest}>{children}</Text> : null;
}
