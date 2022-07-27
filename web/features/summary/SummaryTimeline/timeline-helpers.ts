import type { SummaryItem, SummaryTimelineDivider } from "../types"

export type TimelineItem = SummaryItem | SummaryTimelineDivider

export function createTimeline(items: SummaryItem[]): TimelineItem[] {
  const timeline: TimelineItem[] = []

  // Start with an year in the future
  let currentYear: number = new Date().setFullYear(
    new Date().getFullYear() + 10,
  )

  items.forEach((item) => {
    const sortByDateString = item.date
    const itemYear = (
      sortByDateString ? new Date(sortByDateString) : new Date()
    ).getFullYear()

    if (itemYear !== currentYear) {
      timeline.push({
        id: itemYear.toString(),
        type: "year",
        children: itemYear,
      })
      currentYear = itemYear
    }
    timeline.push(item)
  })

  return timeline
}
