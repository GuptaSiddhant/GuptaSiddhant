import { projectsQuery } from "../helpers/queries";
import DateLine from "../components/DateLine";
import Page from "../components/Page";
import { ItemBox, ItemTitle, ItemSubTitle } from "../components/Item";
import type { PageItemProps, PartialPageProps, ProjectType } from "../types";

export default function Projects(
  props: PartialPageProps<ProjectType>
): JSX.Element {
  return <Page limit={props.limit} query={projectsQuery} Item={ProjectItem} />;
}

function ProjectItem({
  item: project,
  selected,
}: PageItemProps<ProjectType>): JSX.Element {
  const { slug, title, association, tags = [] } = project;
  const { isCurrent, startDate, endDate } = project;
  return (
    <ItemBox key={slug.current}>
      <ItemTitle selected={selected}>{title}</ItemTitle>
      <ItemSubTitle selected={selected}>{association}</ItemSubTitle>
      <DateLine
        {...{ startDate, endDate, isCurrent }}
        additionalText={tags.join(", ")}
      />
    </ItemBox>
  );
}
