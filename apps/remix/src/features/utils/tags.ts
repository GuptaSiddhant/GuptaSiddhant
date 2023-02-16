import { UniqueTag } from "@gs/types";

export function filterUniqueTagsByOccurrence(tags: string[]): UniqueTag[] {
  const tagOccurrenceMap: Record<string, number> = {};
  for (const tag of tags) {
    if (tag) {
      const key = tag.toLowerCase();
      tagOccurrenceMap[key] = (tagOccurrenceMap[key] || 0) + 1;
    }
  }

  const sorted = Object.entries(tagOccurrenceMap).sort(
    ([a], [b]) => tagOccurrenceMap[b] - tagOccurrenceMap[a],
  );

  const uniqueTags: UniqueTag[] = [];
  for (const [value, occurrence] of sorted) {
    uniqueTags.push({ value, occurrence });
  }

  return uniqueTags;
}
