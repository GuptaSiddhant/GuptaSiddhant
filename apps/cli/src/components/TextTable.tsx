import { Newline, Text } from "ink"
import { Fragment } from "react"

export default function TextTable({
  items,
  vertical,
}: {
  vertical?: boolean
  items: { key: string; value: string }[]
}) {
  const maxKeySpace = items.reduce(
    (space, { key }) => Math.max(space, key.length),
    0,
  )

  return (
    <Text>
      {items.map(({ key, value }) => (
        <Fragment key={key}>
          <Newline />
          <Text dimColor>{vertical ? key : key.padEnd(maxKeySpace)}:</Text>
          {vertical ? <Newline /> : " "}
          <Text>{value}</Text>
        </Fragment>
      ))}
    </Text>
  )
}
