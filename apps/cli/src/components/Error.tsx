import { Newline, Text } from "ink"

export default function ErrorText({ error }: { error?: Error }): JSX.Element {
  return (
    <Text color="red">
      {error?.message || "Data not available. Try again later."}
      <Newline />
    </Text>
  )
}
