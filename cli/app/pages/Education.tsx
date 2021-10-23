import React from "react";
import { Box, Text } from "ink";

import { educationQuery } from "../helpers/queries";
import DateLine from "../components/DateLine";
import Page from "../components/Page";
import type { PartialPageProps, EducationType } from "../types";

export default function Education(
  props: PartialPageProps<EducationType>
): JSX.Element {
  return <Page {...props} query={educationQuery} itemBuilder={itemBuilder} />;
}

function itemBuilder(eduction: EducationType): JSX.Element {
  const { slug, isCurrent, degree, school, field } = eduction;
  const { city, country, startDate, endDate } = eduction;
  return (
    <Box key={slug.current} flexDirection="column" marginBottom={1}>
      <Text color={isCurrent ? "green" : "yellow"}>
        {degree} - {field}
      </Text>

      <Text bold>{school}</Text>

      <DateLine
        {...{ startDate, endDate, isCurrent }}
        additionalText={`${city}, ${country}`}
      />
    </Box>
  );
}
