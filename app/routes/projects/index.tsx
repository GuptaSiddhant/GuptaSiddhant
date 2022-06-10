import { useLoaderData } from "@remix-run/react"
import { type LoaderFunction, json } from "@remix-run/server-runtime"

import { getProjectTeaserList } from "~/features/projects/service.server"
import { ErrorSection } from "~/packages/components/Error"
import { H1, Paragraph } from "~/packages/components/Text"
import filterSortTeasers, {
  type FilterSortTeasersReturn,
} from "~/packages/teaser/filter-sort"
import TeaserGrid from "~/packages/teaser/TeaserGrid"
import TeaserHero from "~/packages/teaser/TeaserHero"
import TeaserList from "~/packages/teaser/TeaserList"

interface LoaderData extends FilterSortTeasersReturn {}

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)
  const projects = await getProjectTeaserList(100)
  const filterSortTeasersReturn = filterSortTeasers(projects, searchParams)

  return json<LoaderData>({ ...filterSortTeasersReturn })
}

export default function Projects(): JSX.Element {
  const { teasers, ...filterSortFormProps } = useLoaderData<LoaderData>()

  return (
    <>
      <TeaserHero {...filterSortFormProps} filterPlaceholder="All projects">
        <H1>Projects</H1>
        <Paragraph className="text-secondary">
          I have been busy over the years, trying different things. Some are
          big, some are small and some are unfinished. Nonetheless, I am proud
          of each one of them.
        </Paragraph>
      </TeaserHero>

      {filterSortFormProps.viewAs === "list" ? (
        <TeaserList teasers={teasers} />
      ) : (
        <TeaserGrid teasers={teasers} />
      )}
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ErrorSection title="Could not load projects" message={error.message} />
  )
}

// export const meta: MetaFunction = () => ({
//   title: createMetaTitle("Projects"),
// })
