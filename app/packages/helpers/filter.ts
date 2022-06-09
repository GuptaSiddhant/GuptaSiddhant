export function isTagsAndMatch(
  selectedTags: string[] = [],
  tags: string[] = [],
) {
  if (!selectedTags.length) return true

  const lowercaseTags = tags.map((t) => t.toLowerCase())
  const lowercaseSelectedTags = selectedTags.map((t) => t.toLowerCase())

  return lowercaseSelectedTags.every((tag) => lowercaseTags.includes(tag))
}
