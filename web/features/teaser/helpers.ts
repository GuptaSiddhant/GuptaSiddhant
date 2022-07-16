import { sortByDate } from "@gs/helpers"
import { type DocumentData } from "firebase-admin/firestore"

import type { TeaserProps } from "."

export function getTeasersFromCollection(
  collection: DocumentData[] = [],
  limit = 10,
) {
  return collection
    .map(transformToTeaser)
    .filter(filterPublishedTeaser)
    .sort(sortTeasersByDateLatestFirst)
    .slice(0, limit)
}

export function transformToTeaser<T extends { [key: string]: any }>(
  props: T,
): TeaserProps {
  return {
    id: props.id ?? "",
    title: props.title ?? "",
    subtitle: props.subtitle ?? undefined,
    description: props.description ?? undefined,
    icon: props.icon ?? undefined,
    draft: props.draft ?? undefined,
    date: props.date ?? props.dateStart ?? undefined,
    cover: props.gallery?.[0]?.url ?? undefined,
    featured: props.featured ?? undefined,
    tags: props.tags ?? [],
  }
}

export function sortTeasersByDateLatestFirst(a: TeaserProps, b: TeaserProps) {
  return sortByDate(a.date, b.date)
}

export function sortTeasersByDateOldestFirst(a: TeaserProps, b: TeaserProps) {
  return sortByDate(a.date, b.date, true)
}

export function sortTeasersByFeatured(a: TeaserProps, b: TeaserProps) {
  return (b.featured || false) > (a.featured || false) ? 1 : -1
}

export function filterPublishedTeaser(teaser: TeaserProps) {
  return __IS_DEV__ || !teaser.draft
}

export function getUniqueTagsFromTeaserProps<T extends { tags?: string[] }>(
  teasers: T[],
): UniqueTag[] {
  const availableTags = teasers.flatMap((item) => item.tags).filter(Boolean)

  return filterUniqueTagsByOccurrence(availableTags)
}

export interface UniqueTag {
  value: string
  occurrence: number
}

export function filterUniqueTagsByOccurrence(
  tags: (string | undefined)[],
): { value: string; occurrence: number }[] {
  const tagOccurrenceMap: Record<string, number> = {}
  for (const tag of tags) {
    if (tag) {
      const key = tag.toLowerCase()
      tagOccurrenceMap[key] = (tagOccurrenceMap[key] || 0) + 1
    }
  }
  // const sortedTagsByOccurrence = Object.keys(tagOccurrenceMap).sort(
  //   (a, b) => tagOccurrenceMap[b] - tagOccurrenceMap[a],
  // )

  const sorted = Object.entries(tagOccurrenceMap).sort(
    ([a], [b]) => tagOccurrenceMap[b] - tagOccurrenceMap[a],
  )

  return sorted.reduce(
    (acc, [value, occurrence]) => [...acc, { value, occurrence }],
    [] as Array<{ value: string; occurrence: number }>,
  )
}

export function getCrossSellTeasers(
  teasers: TeaserProps[],
  id: string,
): TeaserProps[] {
  if (teasers.length <= 1) return []

  const currentTeaserIndex = teasers.findIndex((t) => t.id === id)
  if (currentTeaserIndex < 0) return teasers

  const nextTeaserIndex =
    currentTeaserIndex < teasers.length - 1 ? currentTeaserIndex + 1 : 0
  const nextTeaser = teasers[nextTeaserIndex]

  const currentTeaserTags = teasers[currentTeaserIndex]?.tags || []
  const otherTeasersWithSimilarTags = teasers.filter((teaser) => {
    if (teaser.id === id || teaser.id === nextTeaser.id) return false
    return teaser.tags?.some((t) => currentTeaserTags.includes(t))
  })

  return [nextTeaser, ...otherTeasersWithSimilarTags]
}
