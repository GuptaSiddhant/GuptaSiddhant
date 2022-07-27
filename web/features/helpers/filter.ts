export function isTagsAndMatch(
  selectedTags: string[] = [],
  tags: string[] = [],
) {
  if (!selectedTags.length) return true

  const lowercaseTags = tags.map((t) => t.toLowerCase())
  const lowercaseSelectedTags = selectedTags.map((t) => t.toLowerCase())

  return lowercaseSelectedTags.every((tag) => lowercaseTags.includes(tag))
}

export interface UniqueTag {
  value: string
  occurrence: number
}

export function filterUniqueTagsByOccurrence(tags: string[]): UniqueTag[] {
  const tagOccurrenceMap: Record<string, number> = {}
  for (const tag of tags) {
    if (tag) {
      const key = tag.toLowerCase()
      tagOccurrenceMap[key] = (tagOccurrenceMap[key] || 0) + 1
    }
  }

  const sorted = Object.entries(tagOccurrenceMap).sort(
    ([a], [b]) => tagOccurrenceMap[b] - tagOccurrenceMap[a],
  )

  const uniqueTags: UniqueTag[] = []
  for (const [value, occurrence] of sorted) {
    uniqueTags.push({ value, occurrence })
  }

  return uniqueTags
}
