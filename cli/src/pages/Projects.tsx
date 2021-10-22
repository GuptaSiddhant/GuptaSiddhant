import React from "react";
import { Box, Text } from "ink";

import useQuery from "../helpers/useQuery";
import DateLine from "../components/DateLine";
import { LoadingText, ErrorText } from "../components/misc";

interface ProjectType {
  title: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  association: string;
  slug: { current: string };
  tags: string[];
}

const projectsQuery = `* | [_type == "project"] | { slug, title, "tags": tags[] -> value, isCurrent, startDate, endDate, "association": association -> company } | order(isCurrent desc, endDate desc)`;

export default function Projects(): JSX.Element {
  const { data = [], loading, error } = useQuery<ProjectType[]>(projectsQuery);

  if (loading) return <LoadingText />;
  if (error) return <ErrorText error={error} />;

  return (
    <Box flexDirection="column">
      {data.slice(0, 5).map((career) => (
        <CareerItem key={career.slug.current} {...career} />
      ))}
      {data.length > 5 ? <Text dimColor>{"View more on Website."}</Text> : null}
    </Box>
  );
}

function CareerItem(career: ProjectType): JSX.Element {
  const { slug, title, association, tags = [] } = career;
  const { isCurrent, startDate, endDate } = career;
  return (
    <Box key={slug.current} flexDirection="column" marginBottom={1} marginX={1}>
      <Text color={isCurrent ? "green" : "yellow"}>{title}</Text>
      <Text>
        <Text>{association}</Text>
      </Text>
      <DateLine {...{ startDate, endDate }} additionalText={tags.join(", ")} />
    </Box>
  );
}
