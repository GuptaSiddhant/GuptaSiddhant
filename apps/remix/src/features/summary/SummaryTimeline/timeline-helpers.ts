import { TocItem } from "@gs/helpers/table-of-contents";
import type { SummaryItem, SummaryTimelineDivider } from "../types";

export type TimelineItem = SummaryItem | SummaryTimelineDivider;

export function createTimeline(items: SummaryItem[]): TimelineItem[] {
  const timeline: TimelineItem[] = [];

  // Start with an year in the future
  let currentYear: number = new Date().setFullYear(
    new Date().getFullYear() + 10,
  );

  items.forEach((item) => {
    const sortByDateString = item.date;
    const itemYear = (
      sortByDateString ? new Date(sortByDateString) : new Date()
    ).getFullYear();

    if (itemYear !== currentYear) {
      timeline.push({
        id: itemYear.toString(),
        type: "year",
        children: itemYear,
      });
      currentYear = itemYear;
    }
    timeline.push(item);
  });

  return timeline;
}

export function createTocFromLifeline(lifeline: TimelineItem[]): TocItem[] {
  return lifeline
    .map((item) => transformLifelineItemToTocItem(item)!)
    .filter(Boolean);
}

function transformLifelineItemToTocItem(
  item: TimelineItem,
): TocItem | undefined {
  if (!("type" in item)) {
    return undefined;
  }

  if (item.type === "year") {
    return {
      id: item.id,
      level: 0,
      text: item.children?.toString() || item.id,
      children: [],
    };
  }

  return undefined;
}
