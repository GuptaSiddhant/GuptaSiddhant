import { useLoaderData } from "@remix-run/react";
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime";
import {
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime";

import { getBlogSummaryItems } from "@gs/models/blog/index.server";
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
import { parseGetAllSearchParams } from "@gs/utils/request";

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

  const items = await getBlogSummaryItems();
  const selectedTags = parseGetAllSearchParams(searchParams, "tag") ?? [];
  const viewAs =
    (searchParams?.get("view") as ViewAsOption) || ViewAsOption.Timeline;
  const sortBy =
    (searchParams?.get("sort") as SortByOption) || SortByOption.Latest;

  const tags = getUniqueTagsFromSummaryItems(items);
  const summaryItems = filterSortSummaryItems(items, {
    selectedTags,
    sortBy,
  });

  return json<LoaderData>({
    title: "Blog",
    summaryItems,
    selectedTag: selectedTags[0],
    sortBy,
    viewAs,
    tags,
  });
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: createMetaTitle(data?.title),
});

export default function Blog(): JSX.Element {
  const { title, summaryItems, viewAs, selectedTag, sortBy, tags } =
    useLoaderData<LoaderData>();

  return (
    <>
      <SummaryHero
        filterPlaceholder="All posts"
        title={title}
        subtitle="Thoughts on somethings. Sometimes everything."
        tags={tags}
        selectedTag={selectedTag}
        sortBy={sortBy}
        viewAs={viewAs}
      />

      {viewAs === ViewAsOption.Grid ? (
        <SummaryGrid items={summaryItems} />
      ) : (
        <SummaryTimeline items={summaryItems} />
      )}
    </>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection title="Could not load blog" error={error} />;
};
