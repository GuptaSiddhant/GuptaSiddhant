import { useLoaderData } from "@remix-run/react"
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime"
import {
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime"

import { getBlogPostTeaserList } from "~/features/blog/service.server"
import { createMetaTitle } from "~/features/helpers/meta"
import filterSortTeasers, {
  type FilterSortTeasersReturn,
} from "~/features/teaser/filter-sort"
import TeaserGrid from "~/features/teaser/TeaserGrid"
import TeaserHero from "~/features/teaser/TeaserHero"
import TeaserList from "~/features/teaser/TeaserList"
import { ErrorSection } from "~/features/ui/Error"

interface LoaderData extends FilterSortTeasersReturn {
  title: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)
  const blogPosts = await getBlogPostTeaserList(100)
  const filterSortTeasersReturn = filterSortTeasers(blogPosts, searchParams, {
    defaultViewAs: "list",
  })

  return json<LoaderData>({ ...filterSortTeasersReturn, title: "Blog" })
}

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: createMetaTitle(data?.title),
})

export default function Blog(): JSX.Element {
  const { title, teasers, ...filterSortFormProps } = useLoaderData<LoaderData>()

  return (
    <>
      <TeaserHero
        {...filterSortFormProps}
        filterPlaceholder="All posts"
        title={title}
        subtitle="Thoughts on somethings. Sometimes everything."
      />

      {filterSortFormProps.viewAs === "list" ? (
        <TeaserList teasers={teasers} />
      ) : (
        <TeaserGrid teasers={teasers} />
      )}
    </>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection title="Could not load projects" error={error} />
}
