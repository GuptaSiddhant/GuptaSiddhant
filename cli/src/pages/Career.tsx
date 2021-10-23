import React from "react";
import { Box, Text } from "ink";

import { careerQuery } from "../helpers/queries";
import DateLine from "../components/DateLine";
import Page from "../components/Page";
import type { PartialPageProps, CareerType } from "../types";

export default function Career(
  props: PartialPageProps<CareerType>
): JSX.Element {
  return <Page {...props} query={careerQuery} itemBuilder={itemBuilder} />;
}

function itemBuilder(career: CareerType): JSX.Element {
  const { slug, isCurrent, position, company, city } = career;
  const { country, type, startDate, endDate } = career;
  return (
    <Box key={slug.current} flexDirection="column" marginBottom={1}>
      <Text color={isCurrent ? "green" : "yellow"}>{position}</Text>
      <Text>
        <Text bold>{company}</Text>, {city}, {country}
      </Text>
      <DateLine {...{ startDate, endDate, isCurrent }} additionalText={type} />
    </Box>
  );
}
