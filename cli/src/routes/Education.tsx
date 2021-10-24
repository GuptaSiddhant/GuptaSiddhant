import { educationQuery } from "../helpers/queries";
import DateLine from "../components/DateLine";
import Page from "../components/Page";
import { ItemBox, ItemTitle, ItemSubTitle } from "../components/Item";
import type { PartialPageProps, EducationType, PageItemProps } from "../types";

export default function Education(
  props: PartialPageProps<EducationType>
): JSX.Element {
  return <Page {...props} query={educationQuery} Item={EducationItem} />;
}

function EducationItem({
  item: eduction,
  selected,
}: PageItemProps<EducationType>): JSX.Element {
  const { slug, isCurrent, degree, school, field } = eduction;
  const { city, country, startDate, endDate } = eduction;
  return (
    <ItemBox key={slug.current}>
      <ItemTitle selected={selected}>
        {degree} - {field}
      </ItemTitle>
      <ItemSubTitle selected={selected}>{school}</ItemSubTitle>
      <DateLine
        {...{ startDate, endDate, isCurrent }}
        additionalText={`${city}, ${country}`}
      />
    </ItemBox>
  );
}
