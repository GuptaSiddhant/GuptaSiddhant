import { ViewAsOption } from "@gs/summary"

import { type TeaserProps, SortByOption } from "."
import {
  getUniqueTagsFromTeaserProps,
  sortTeasersByDateOldestFirst,
  sortTeasersByFeatured,
} from "./helpers"

export default function filterSortTeasers(
  teasers: TeaserProps[],
  searchParams?: URLSearchParams,
  options?: {
    defaultViewAs?: ViewAsOption
    defaultSortBy?: SortByOption
  },
) {
  const {
    defaultViewAs = ViewAsOption.Grid,
    defaultSortBy = SortByOption.Latest,
  } = options || {}

  const tags = getUniqueTagsFromTeaserProps(teasers)

  const selectedTag = searchParams?.get("tag") ?? undefined
  const viewAs = (searchParams?.get("view") ?? defaultViewAs) as ViewAsOption
  const sortBy = (searchParams?.get("sort") ?? defaultSortBy) as SortByOption

  const sortPredicate =
    sortBy === SortByOption.Oldest
      ? sortTeasersByDateOldestFirst
      : sortBy === SortByOption.Featured
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
