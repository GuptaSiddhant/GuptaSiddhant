import { useLoaderData } from "@remix-run/react"
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime"
import {
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime"

import type { UniqueTag } from "@gs/helpers/filter"
import { createMetaTitle } from "@gs/helpers/meta"
import { parseGetAllSearchParams } from "@gs/helpers/request"
import { getProjectsSummaryItems } from "@gs/projects/service.server"
import type { SortByOption, SummaryItem } from "@gs/summary"
import {
  filterSortSummaryItems,
  getUniqueTagsFromSummaryItems,
  ViewAsOption,
} from "@gs/summary"
import SummaryGrid from "@gs/summary/SummaryGrid"
import SummaryTimeline from "@gs/summary/SummaryTimeline"
import TeaserHero from "@gs/teaser/TeaserHero"
import { ErrorSection } from "@gs/ui/Error"

interface LoaderData {
  title: string
  summaryItems: SummaryItem[]
  selectedTag: string
  sortBy: SortByOption
  viewAs: ViewAsOption
  tags: UniqueTag[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)
  const items = await getProjectsSummaryItems()
  const selectedTags = parseGetAllSearchParams(searchParams, "tag") ?? []
  const viewAs = searchParams?.get("view") as ViewAsOption
  const sortBy = searchParams?.get("sort") as SortByOption

  const tags = getUniqueTagsFromSummaryItems(items)
  const summaryItems = filterSortSummaryItems(items, {
    selectedTags,
    sortBy,
  })

  return json<LoaderData>({
    summaryItems,
    title: "Projects",
    selectedTag: selectedTags[0],
    sortBy,
    viewAs,
    tags,
  })
}

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: createMetaTitle(data?.title),
})

export default function Projects(): JSX.Element {
  const { title, summaryItems, viewAs, selectedTag, sortBy, tags } =
    useLoaderData<LoaderData>()

  return (
    <>
      <TeaserHero
        filterPlaceholder="All projects"
        title={title}
        subtitle="I have been busy over the years, trying different things. Some are
        big, some are small and some are unfinished."
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
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection title="Could not load projects" error={error} />
}
