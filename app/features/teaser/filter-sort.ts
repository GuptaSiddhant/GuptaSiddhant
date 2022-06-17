import { type TeaserProps } from "."
import {
  getUniqueTagsFromTeaserProps,
  sortTeasersByDateOldestFirst,
  sortTeasersByFeatured,
} from "./helpers"

type ViewAsType = "grid" | "list"
type SortByType = "latest" | "oldest" | "featured"

export default function filterSortTeasers(
  teasers: TeaserProps[],
  searchParams?: URLSearchParams,
  options?: {
    defaultViewAs?: ViewAsType
    defaultSortBy?: SortByType
  },
) {
  const { defaultViewAs = "grid", defaultSortBy = "latest" } = options || {}

  const tags = getUniqueTagsFromTeaserProps(teasers)

  const selectedTag = searchParams?.get("tag") ?? undefined
  const viewAs = (searchParams?.get("view") ?? defaultViewAs) as ViewAsType
  const sortBy = (searchParams?.get("sort") ?? defaultSortBy) as SortByType

  const sortPredicate =
    sortBy === "oldest"
      ? sortTeasersByDateOldestFirst
      : sortBy === "featured"
      ? sortTeasersByFeatured
      : undefined

  const filteredTeasers = selectedTag
    ? teasers.filter(({ tags = [] }) => {
        return tags
          .map((tag) => tag.toLowerCase())
          .includes(selectedTag.toLowerCase())
      })
    : teasers
  const sortedTeasers = sortPredicate
    ? filteredTeasers.sort(sortPredicate)
    : filteredTeasers

  return {
    teasers: sortedTeasers,
    tags,
    viewAs,
    sortBy,
    selectedTag,
  }
}

export type FilterSortTeasersReturn = ReturnType<typeof filterSortTeasers>
