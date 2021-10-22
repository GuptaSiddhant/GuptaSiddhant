import React from "react";
import { Box, Text } from "ink";
import useQuery from "../helpers/useQuery";
import DateLine from "../components/DateLine";
import { LoadingText, ErrorText } from "../components/misc";

interface EducationType {
  degree: string;
  field: string;
  school: string;
  startDate: string;
  endDate?: string;
  city: string;
  country: string;
  isCurrent: boolean;
  slug: { current: string };
}

const educationQuery = `* | [_type == "education"] | { slug, degree, field, school, isCurrent, startDate, endDate, "city": location -> city, "country": location -> country } | order(isCurrent desc, endDate desc)`;

export default function Education(): JSX.Element {
  const { data, loading, error } = useQuery<EducationType[]>(educationQuery);

  if (loading) return <LoadingText />;
  if (error) return <ErrorText error={error} />;

  return (
    <Box flexDirection="column">
      {data?.map((eduction) => (
        <EducationItem key={eduction.slug.current} {...eduction} />
      ))}
    </Box>
  );
}

function EducationItem(eduction: EducationType): JSX.Element {
  const { slug, isCurrent, degree, school, field } = eduction;
  const { city, country, startDate, endDate } = eduction;
  return (
    <Box key={slug.current} flexDirection="column" marginBottom={1} marginX={1}>
      <Text color={isCurrent ? "green" : "yellow"}>
        {degree} - {field}
      </Text>

      <Text bold>{school}</Text>

      <DateLine
        {...{ startDate, endDate }}
        additionalText={`${city}, ${country}`}
      />
    </Box>
  );
}
