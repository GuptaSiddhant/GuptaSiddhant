import { sortByDate } from "~/features/helpers"
import { formatDate } from "~/features/helpers/format"

import type { CareerProps, EducationProps } from "../about"
import { type CommonCareerEducationProps } from "../about"
import type { LifeLineItems } from "."

export function createDurationString({
  startDate,
  endDate,
}: CommonCareerEducationProps): string {
  const start = formatDate(startDate, { day: undefined })
  const end = endDate ? formatDate(endDate, { day: undefined }) : "Present"

  return `${start} - ${end}`
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
