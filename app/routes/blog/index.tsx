import { useLoaderData } from "@remix-run/react"
import { type LoaderFunction, json } from "@remix-run/server-runtime"

import { getBlogPostTeaserList } from "~/features/blog/service.server"
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
  const blogPosts = await getBlogPostTeaserList(100)
  const filterSortTeasersReturn = filterSortTeasers(blogPosts, searchParams, {
    defaultViewAs: "list",
  })

  return json<LoaderData>({ ...filterSortTeasersReturn })
}

export default function Blog(): JSX.Element {
  const { teasers, ...filterSortFormProps } = useLoaderData<LoaderData>()

  return (
    <>
      <TeaserHero
        {...filterSortFormProps}
        filterPlaceholder="All posts"
        teasersCount={teasers.length}
      >
        <H1>Blog</H1>
        <Paragraph className="text-secondary">
          Thoughts on somethings. Sometimes everything.
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

// export const meta: MetaFunction = () => ({
//   title: createMetaTitle("Projects"),
// })
