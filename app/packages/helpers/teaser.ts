import { type DocumentData } from "firebase-admin/firestore"

import { __IS_DEV__ } from "~/packages/constants"
import type { TeaserProps } from "~/packages/types"

export { TeaserProps }

export function getTeasersFromCollection(
  collection: DocumentData[] = [],
  limit = 10,
) {
  return collection
    .map(transformToTeaser)
    .filter(filterPublishedTeaser)
    .sort(sortTeasersByDate)
    .slice(0, limit)
}

export function transformToTeaser<T extends { [key: string]: any }>(
  props: T,
): TeaserProps {
  return {
    id: props.id,
    title: props.title,
    subtitle: props.subtitle,
    icon: props.icon,
    draft: props.draft,
    date: props.date ?? props.dateStart,
    cover: props.gallery?.[0]?.url,
  }
}

export function sortTeasersByDate(a: TeaserProps, b: TeaserProps) {
  return (b.date || new Date().toISOString()) >
    (a.date || new Date().toISOString())
    ? 1
    : -1
}

export function filterPublishedTeaser(teaser: TeaserProps) {
  return __IS_DEV__ || !teaser.draft
}
