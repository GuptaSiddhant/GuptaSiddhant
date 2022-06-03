import { careerQuery } from "../helpers/queries";
import DateLine from "../components/DateLine";
import Page from "../components/Page";
import {
  ItemBox,
  ItemTitle,
  ItemSubTitle,
  ItemDescription,
} from "../components/Item";
import type { PartialPageProps, CareerType, PageItemProps } from "../types";

export default function Career(
  props: PartialPageProps<CareerType>
): JSX.Element {
  return <Page {...props} query={careerQuery} Item={CareerItem} />;
}

function CareerItem({
  item: career,
  selected,
}: PageItemProps<CareerType>): JSX.Element {
  const { slug, isCurrent, position, company, city } = career;
  const { country, type, startDate, endDate, tags } = career;
  return (
    <ItemBox key={slug.current}>
      <ItemTitle selected={selected}>{position}</ItemTitle>
      <ItemSubTitle selected={selected}>
        {company}, {city}, {country}
      </ItemSubTitle>
      <DateLine {...{ startDate, endDate, isCurrent }} additionalText={type} />
      <ItemDescription selected={selected}>{tags.join(", ")}</ItemDescription>
    </ItemBox>
  );
}
