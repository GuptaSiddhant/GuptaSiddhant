import { filterUniqueTagsByOccurrence } from "@gs/helpers/filter";
import { sortByDate, typedBoolean } from "@gs/utils/sort-filter";

import type { SummaryItem } from "./types";

export enum ViewAsOption {
  Grid = "grid",
  Timeline = "timeline",
}

export enum SortByOption {
  Latest = "latest",
  Oldest = "oldest",
  Featured = "featured",
}

export function getUniqueTagsFromSummaryItems<T extends { tags?: string[] }>(
  items: T[],
) {
  return filterUniqueTagsByOccurrence(
    items.flatMap((item) => item.tags).filter(typedBoolean),
  );
}

// Filter and sort the items
export function filterSortSummaryItems(
  items: SummaryItem[],
  options?: {
    sortBy?: SortByOption;
    selectedTags?: string[];
    query?: string;
  },
) {
  const {
    sortBy = SortByOption.Latest,
    selectedTags = [],
    query = "",
  } = options || {};

  const filteredItems =
    selectedTags.length > 0 || query
      ? items
          .filter(filterPublishedSummaryItemPredicate)
          .filter((item) =>
            filterSummaryItemsByQueryAndTagsPredicate(
              item,
              selectedTags,
              query,
            ),
          )
      : items;

  const sortPredicate =
    sortBy === SortByOption.Featured
      ? sortSummaryItemsByFeaturedPredicate
      : sortBy === SortByOption.Oldest
      ? sortSummaryItemsByDateOldestFirstPredicate
      : sortSummaryItemsByDateLatestFirstPredicate;

  return filteredItems.sort(sortPredicate);
}

export function sortSummaryItemsByDateLatestFirstPredicate(
  a: SummaryItem,
  b: SummaryItem,
) {
  return sortByDate(a.date, b.date);
}

export function sortSummaryItemsByDateOldestFirstPredicate(
  a: SummaryItem,
  b: SummaryItem,
) {
  return sortByDate(a.date, b.date, true);
}

export function sortSummaryItemsByFeaturedPredicate(
  a: SummaryItem,
  b: SummaryItem,
) {
  const aFeatured = a.featured ? 1 : 0;
  const bFeatured = b.featured ? 1 : 0;

  return bFeatured > aFeatured ? 1 : -1;
}

export function filterPublishedSummaryItemPredicate(item: SummaryItem) {
  return __IS_DEV__ || !item.draft;
}

export function filterSummaryItemsByQueryAndTagsPredicate(
  item: SummaryItem,
  selectedTags: string[],
  query: string,
) {
  const { tags = [], title, subtitle } = item;
  const lowerCaseQuery = query.toLowerCase().trim();
  const lowerCaseSelectedTags = selectedTags.map((t) => t.toLowerCase());

  // Tags
  const lowercaseTags = tags.map((tag) => tag.toLowerCase());
  if (
    lowercaseTags.some(
      (tag) =>
        lowerCaseSelectedTags.includes(tag) ||
        (lowerCaseQuery ? tag.includes(lowerCaseQuery) : false),
    )
  ) {
    return true;
  }

  if (
    lowerCaseQuery &&
    [title, subtitle]
      .filter(typedBoolean)
      .map((t) => t.toLowerCase())
      .some((t) => t.includes(lowerCaseQuery))
  ) {
    return true;
  }

  return false;
}

export function getCrossSellSummaryItems(
  items: SummaryItem[],
  id: string,
): SummaryItem[] {
  if (items.length <= 1) {
    return [];
  }

  const currentItemIndex = items.findIndex((t) => t.id === id);
  if (currentItemIndex < 0) {
    return items;
  }

  const nextItemIndex =
    currentItemIndex < items.length - 1 ? currentItemIndex + 1 : 0;
  const nextItem = items[nextItemIndex];

  const currentItemTags = items[currentItemIndex]?.tags || [];
  const otherItemsWithSimilarTags = items.filter((item) => {
    if (item.id === id || item.id === nextItem.id) {
      return false;
    }

    return item.tags?.some((t) => currentItemTags.includes(t));
  });

  return [nextItem, ...otherItemsWithSimilarTags];
}
