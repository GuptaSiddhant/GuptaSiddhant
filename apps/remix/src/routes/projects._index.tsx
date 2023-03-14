import { useLoaderData } from "@remix-run/react";
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime";
import {
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime";

import { getProjectsSummaryItems } from "@gs/models/projects/index.server";
import {
  SortByOption,
  type SummaryItem,
  ViewAsOption,
  filterSortSummaryItems,
  getUniqueTagsFromSummaryItems,
} from "@gs/summary";
import SummaryGrid from "@gs/summary/SummaryGrid";
import SummaryHero from "@gs/summary/SummaryHero";
import SummaryTimeline from "@gs/summary/SummaryTimeline";
import type { UniqueTag } from "@gs/types";
import { ErrorSection } from "@gs/ui/Error";
import { createMetaTitle } from "@gs/utils/meta";
import { parseGetAllSearchParams } from "@gs/utils/navigation";

interface LoaderData {
  title: string;
  summaryItems: SummaryItem[];
  selectedTag: string;
  sortBy: SortByOption;
  viewAs: ViewAsOption;
  tags: UniqueTag[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const items = await getProjectsSummaryItems();
  const selectedTags = parseGetAllSearchParams(searchParams, "tag") ?? [];
  const viewAs =
    (searchParams?.get("view") as ViewAsOption) || ViewAsOption.Grid;
  const sortBy =
    (searchParams?.get("sort") as SortByOption) || SortByOption.Latest;

  const tags = getUniqueTagsFromSummaryItems(items);
  const summaryItems = filterSortSummaryItems(items, {
    selectedTags,
    sortBy,
  });

  return json<LoaderData>({
    summaryItems,
    title: "Projects",
    selectedTag: selectedTags[0],
    sortBy,
    viewAs,
    tags,
  });
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: createMetaTitle(data?.title),
});

export default function Projects(): JSX.Element {
  const { title, summaryItems, viewAs, selectedTag, sortBy, tags } =
    useLoaderData<LoaderData>();

  return (
    <>
      <SummaryHero
        filterPlaceholder="All projects"
        title={title}
        subtitle="I have been busy over the years, trying different things. Some are
        big, some are small and some are unfinished."
        tags={tags}
        selectedTag={selectedTag}
        sortBy={sortBy}
        viewAs={viewAs}
      />

      {!viewAs || viewAs === ViewAsOption.Grid ? (
        <SummaryGrid items={summaryItems} />
      ) : (
        <SummaryTimeline items={summaryItems} />
      )}
    </>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection title="Could not load projects" error={error} />;
};
