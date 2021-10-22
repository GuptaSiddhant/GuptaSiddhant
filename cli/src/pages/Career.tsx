import React from "react";
import { Box, Text } from "ink";

import useQuery from "../helpers/useQuery";
import DateLine from "../components/DateLine";
import { LoadingText, ErrorText } from "../components/misc";

interface CareerType {
  position: string;
  company: string;
  type: string;
  startDate: string;
  endDate?: string;
  city: string;
  country: string;
  isCurrent: boolean;
  slug: { current: string };
}

const careerQuery = `* | [_type == "career"] | { slug, position, type, company, isCurrent, startDate, endDate, "city": location -> city, "country": location -> country,} | order(isCurrent desc, endDate desc)`;

export default function Career(): JSX.Element {
  const { data, loading, error } = useQuery<CareerType[]>(careerQuery);

  if (loading) return <LoadingText />;
  if (error) return <ErrorText error={error} />;

  return (
    <Box flexDirection="column">
      {data?.map((career) => (
        <CareerItem key={career.slug.current} {...career} />
      ))}
    </Box>
  );
}

function CareerItem(career: CareerType): JSX.Element {
  const { slug, isCurrent, position, company, city } = career;
  const { country, type, startDate, endDate } = career;
  return (
    <Box key={slug.current} flexDirection="column" marginBottom={1} marginX={1}>
      <Text color={isCurrent ? "green" : "yellow"}>{position}</Text>
      <Text>
        <Text bold>{company}</Text>, {city}, {country}
      </Text>
      <DateLine {...{ startDate, endDate }} additionalText={type} />
    </Box>
  );
}
