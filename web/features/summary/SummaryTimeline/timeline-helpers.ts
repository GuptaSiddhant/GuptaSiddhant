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

// From lifeline

// type ExperienceProps = any
// type LifeLineItem = any

// export function createLifeline(
//   items: ExperienceProps[],
//   selectedTags: string[] = [],
// ): LifeLineItem[] {
//   const filteredItems =
//     selectedTags.length > 0
//       ? items.filter((item) =>
//           item.tags
//             ? item.tags.some((tag: string) =>
//                 selectedTags.includes(tag.toLowerCase()),
//               )
//             : true,
//         )
//       : items

//   const sortBy: "startDate" | "endDate" = "endDate"
//   const sortedItems = filteredItems.sort((a, b) =>
//     sortByDate(a[sortBy], b[sortBy]),
//   )

//   const lifeline: LifeLineItem[] = []

//   // Start with an year in the future
//   let currentYear: number = new Date().setFullYear(
//     new Date().getFullYear() + 10,
//   )

//   sortedItems.forEach((item) => {
//     const sortByDateString = item[sortBy]
//     const itemYear = (
//       sortByDateString ? new Date(sortByDateString) : new Date()
//     ).getFullYear()

//     if (itemYear !== currentYear) {
//       lifeline.push({
//         id: itemYear.toString(),
//         type: "year",
//         children: itemYear,
//       })
//       currentYear = itemYear
//     }
//     lifeline.push(item)
//   })

//   return lifeline
// }

// export function createTocFromLifeline(lifeline: LifeLineItem[]): TocItem[] {
//   return lifeline
//     .map((item) => transformLifelineItemToTocItem(item)!)
//     .filter(Boolean)
// }

// function transformLifelineItemToTocItem(
//   item: LifeLineItem,
// ): TocItem | undefined {
//   if ("children" in item)
//     return {
//       id: item.id,
//       level: 1,
//       text: item.children?.toString() || item.id,
//       children: [],
//     }

//   return undefined
// }
