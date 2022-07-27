import { useLoaderData } from "@remix-run/react"
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime"
import {
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime"

import { getBlogSummaryItems } from "@gs/blog/service.server"
import { createMetaTitle } from "@gs/helpers/meta"
import type { SummaryItem } from "@gs/summary"
import { ViewAsOption } from "@gs/summary"
import SummaryGrid from "@gs/summary/SummaryGrid"
import SummaryTimeline from "@gs/summary/SummaryTimeline"
import filterSortTeasers, {
  type FilterSortTeasersReturn,
} from "@gs/teaser/filter-sort"
import TeaserHero from "@gs/teaser/TeaserHero"
import { ErrorSection } from "@gs/ui/Error"

interface LoaderData extends FilterSortTeasersReturn {
  title: string
  summaryItems: SummaryItem[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)
  // const blogPosts = await getBlogPostTeaserList(100)
  const summaryItems = await getBlogSummaryItems()
  const filterSortTeasersReturn = filterSortTeasers(
    summaryItems,
    searchParams,
    {
      defaultViewAs: ViewAsOption.Timeline,
    },
  )

  return json<LoaderData>({
    ...filterSortTeasersReturn,
    title: "Blog",
    summaryItems,
  })
}

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: createMetaTitle(data?.title),
})

export default function Blog(): JSX.Element {
  const { title, teasers, summaryItems, ...filterSortFormProps } =
    useLoaderData<LoaderData>()

  return (
    <>
      <TeaserHero
        {...filterSortFormProps}
        filterPlaceholder="All posts"
        title={title}
        subtitle="Thoughts on somethings. Sometimes everything."
      />

      {filterSortFormProps.viewAs === ViewAsOption.Timeline ? (
        <SummaryTimeline items={summaryItems} />
      ) : (
        <SummaryGrid items={summaryItems} />
      )}
    </>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection title="Could not load blog" error={error} />
}
