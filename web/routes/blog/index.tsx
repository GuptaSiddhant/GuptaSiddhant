import { getBlogPostTeaserList } from "@gs/blog/service.server"
import { createMetaTitle } from "@gs/helpers/meta"
import filterSortTeasers, {
  type FilterSortTeasersReturn,
} from "@gs/teaser/filter-sort"
import TeaserGrid from "@gs/teaser/TeaserGrid"
import TeaserHero from "@gs/teaser/TeaserHero"
import TeaserList from "@gs/teaser/TeaserList"
import { ErrorSection } from "@gs/ui/Error"
import { useLoaderData } from "@remix-run/react"
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime"
import {
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime"

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