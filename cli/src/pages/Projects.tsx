import { Box, Text } from "../ink";
import { projectsQuery } from "../helpers/queries";
import DateLine from "../components/DateLine";
import Page from "../components/Page";
import type { PartialPageProps, ProjectType } from "../types";

export default function Projects(
  props: PartialPageProps<ProjectType>
): JSX.Element {
  return (
    <Page limit={props.limit} query={projectsQuery} itemBuilder={itemBuilder} />
  );
}

function itemBuilder(project: ProjectType): JSX.Element {
  const { slug, title, association, tags = [] } = project;
  const { isCurrent, startDate, endDate } = project;
  return (
    <Box key={slug.current} flexDirection="column" marginBottom={1}>
      <Text color={isCurrent ? "green" : "yellow"}>{title}</Text>
      <Text>
        <Text>{association}</Text>
      </Text>
      <DateLine
        {...{ startDate, endDate, isCurrent }}
        additionalText={tags.join(", ")}
      />
    </Box>
  );
}
