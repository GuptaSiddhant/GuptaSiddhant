import { useLoaderData } from "@remix-run/react"
import {
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/server-runtime"

import { getBlogPostTeaserList } from "~/features/blog/service.server"
import { createMetaTitle } from "~/packages/helpers"
import filterSortTeasers, {
  type FilterSortTeasersReturn,
} from "~/packages/teaser/filter-sort"
import TeaserGrid from "~/packages/teaser/TeaserGrid"
import TeaserHero from "~/packages/teaser/TeaserHero"
import TeaserList from "~/packages/teaser/TeaserList"

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
  title: createMetaTitle(data.title),
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

// export const meta: MetaFunction = () => ({
//   title: createMetaTitle("Projects"),
// })
