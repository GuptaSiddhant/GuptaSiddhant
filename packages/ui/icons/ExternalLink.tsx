import LinkIcon from "remixicon-react/ExternalLinkLineIcon"

export default function ExternalLink(): JSX.Element {
  return (
    <LinkIcon
      aria-label="External link"
      style={{
        display: "inline-block",
        marginLeft: "0.2em",
        verticalAlign: "middle",
      }}
      size="1em"
    />
  )
}
