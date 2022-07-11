import { Text } from "ink"

import {
  ItemBox,
  ItemDescription,
  ItemSubTitle,
  ItemTitle,
} from "../components/Item"
import Page from "../components/Page"
import { useProjectsQuery } from "../helpers/queries"
import type { PageItemProps, PartialPageProps, TeaserProps } from "../types"

export default function Projects(
  props: PartialPageProps<TeaserProps>,
): JSX.Element {
  return (
    <Page limit={props.limit} queryFn={useProjectsQuery} Item={ProjectItem} />
  )
}

function ProjectItem({
  item,
  selected,
}: PageItemProps<TeaserProps>): JSX.Element {
  const { id, title, subtitle, date, tags = [] } = item

  return (
    <ItemBox key={id}>
      <ItemTitle selected={selected}>{title}</ItemTitle>
      <ItemSubTitle selected={selected}>{subtitle}</ItemSubTitle>
      <Text dimColor>{date?.slice(0, 7)}</Text>
      <ItemDescription selected={selected}>{tags.join(", ")}</ItemDescription>
    </ItemBox>
  )
}
