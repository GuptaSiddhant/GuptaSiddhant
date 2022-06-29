import { sortByDate } from "~/features/helpers"
import type { TocItem } from "~/features/helpers/table-of-contents"

import type { CareerProps, EducationProps } from "~/features/aboutt"
import type { LifeLineItem, LifeLineItems } from "."

export function createLifeline(
  items: (CareerProps | EducationProps)[],
): LifeLineItems {
  const sortBy: "startDate" | "endDate" = "endDate"
  const sortedItems = items.sort((a, b) => sortByDate(a[sortBy], b[sortBy]))

  const lifeline: LifeLineItems = [
    { id: "now", children: "Present", type: "year" },
  ]

  let currentYear: number = new Date().getFullYear()
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
