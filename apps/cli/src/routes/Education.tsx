import DateLine from "../components/DateLine"
import {
  ItemBox,
  ItemDescription,
  ItemSubTitle,
  ItemTitle,
} from "../components/Item"
import Page from "../components/Page"
import { useEducationQuery } from "../helpers/queries"
import type { ExperienceProps, PageItemProps, PartialPageProps } from "../types"

export default function Education(
  props: PartialPageProps<ExperienceProps>,
): JSX.Element {
  return <Page {...props} queryFn={useEducationQuery} Item={EducationItem} />
}

function EducationItem({
  item,
  selected,
}: PageItemProps<ExperienceProps>): JSX.Element {
  const { id, title, subtitle, tags = [], startDate, endDate } = item

  return (
    <ItemBox key={id}>
      <ItemTitle selected={selected}>{title}</ItemTitle>
      <ItemSubTitle selected={selected}>{subtitle}</ItemSubTitle>
      <DateLine {...{ startDate, endDate }} />
      <ItemDescription selected={selected}>{tags.join(", ")}</ItemDescription>
    </ItemBox>
  )
}
