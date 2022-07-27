import { type DocumentData } from "firebase-admin/firestore"

import { sortByDate, typedBoolean } from "@gs/helpers"
import { filterUniqueTagsByOccurrence } from "@gs/helpers/filter"

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
) {
  const availableTags = teasers
    .flatMap((item) => item.tags)
    .filter(typedBoolean)

  return filterUniqueTagsByOccurrence(availableTags)
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
