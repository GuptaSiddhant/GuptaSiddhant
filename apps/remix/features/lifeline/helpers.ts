import type { ExperienceProps } from "@features/experiences/types"
import { sortByDate } from "@features/helpers"
import type { TocItem } from "@features/helpers/table-of-contents"

import type { LifeLineItem, LifeLineItems } from "."

export function createLifeline(
  items: ExperienceProps[],
  selectedTags: string[] = [],
): LifeLineItems {
  const filteredItems =
    selectedTags.length > 0
      ? items.filter((item) =>
          item.tags
            ? item.tags.some((tag) => selectedTags.includes(tag.toLowerCase()))
            : true,
        )
      : items

  const sortBy: "startDate" | "endDate" = "endDate"
  const sortedItems = filteredItems.sort((a, b) =>
    sortByDate(a[sortBy], b[sortBy]),
  )

  const lifeline: LifeLineItems = []

  // Start with an year in the future
  let currentYear: number = new Date().setFullYear(
    new Date().getFullYear() + 10,
  )

  sortedItems.forEach((item) => {
    const sortByDateString = item[sortBy]
    const itemYear = (
      sortByDateString ? new Date(sortByDateString) : new Date()
    ).getFullYear()

    if (itemYear !== currentYear) {
      lifeline.push({
        id: itemYear.toString(),
        type: "year",
        children: itemYear,
      })
      currentYear = itemYear
    }
    lifeline.push(item)
  })

  return lifeline
}

export function createTocFromLifeline(lifeline: LifeLineItem[]): TocItem[] {
  return lifeline
    .map((item) => transformLifelineItemToTocItem(item)!)
    .filter(Boolean)
}

function transformLifelineItemToTocItem(
  item: LifeLineItem,
): TocItem | undefined {
  if ("children" in item)
    return {
      id: item.id,
      level: 1,
      text: item.children?.toString() || item.id,
      children: [],
    }

  return undefined
}
