import { createMetaTitle } from "@features/helpers/meta"
import { getProjectTeaserList } from "@features/projects/service.server"
import filterSortTeasers, {
  type FilterSortTeasersReturn,
} from "@features/teaser/filter-sort"
import TeaserGrid from "@features/teaser/TeaserGrid"
import TeaserHero from "@features/teaser/TeaserHero"
import TeaserList from "@features/teaser/TeaserList"
import { ErrorSection } from "@features/ui/Error"
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
  const projects = await getProjectTeaserList(100)
  const filterSortTeasersReturn = filterSortTeasers(projects, searchParams)

  return json<LoaderData>({ ...filterSortTeasersReturn, title: "Projects" })
}

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: createMetaTitle(data?.title),
})

export default function Projects(): JSX.Element {
  const { title, teasers, ...filterSortFormProps } = useLoaderData<LoaderData>()

  return (
    <>
      <TeaserHero
        {...filterSortFormProps}
        filterPlaceholder="All projects"
        title={title}
        subtitle="I have been busy over the years, trying different things. Some are
        big, some are small and some are unfinished."
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
