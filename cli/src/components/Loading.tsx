import { Newline, Text } from "ink";

export default function LoadingText(): JSX.Element {
  return (
    <Text dimColor>
      {"Loading..."} <Newline />
    </Text>
  );
}
