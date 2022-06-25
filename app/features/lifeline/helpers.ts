import { sortByDate } from "~/features/helpers"
import { formatDate } from "~/features/helpers/format"

import type { CareerProps, EducationProps } from "../about"
import { type CommonCareerEducationProps } from "../about"
import type { TocItem } from "../helpers/table-of-contents"
import type { LifeLineItem, LifeLineItems } from "."

export function createDurationString(
  { startDate, endDate }: CommonCareerEducationProps,
  options: Intl.DateTimeFormatOptions = {},
): string {
  const start = formatDate(startDate, { day: undefined, ...options })
  const end = endDate
    ? formatDate(endDate, { day: undefined, ...options })
    : "Present"

  return [start, end].filter(Boolean).join(" - ")
}

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
