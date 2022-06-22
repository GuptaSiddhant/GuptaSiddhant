export interface TocItem {
  level: number
  id: string
  text: string
  children: TocItem[]
}

export function arrangeTocByLevels(
  toc: TocItem[],
  currentItem: TocItem,
  currentIndex: number,
  originalList: TocItem[],
) {
  const currentLevel = currentItem.level
  const parentIndex = toc.findIndex((i) => currentLevel > i.level) > -1
  if (parentIndex) return toc

  const nextElementIndexWithSameLevel = originalList
    .slice(currentIndex + 1)
    .find((i) => i.level === currentLevel)
  const nextIndex = nextElementIndexWithSameLevel
    ? originalList.indexOf(nextElementIndexWithSameLevel)
    : originalList.length
  const subArray = originalList.slice(currentIndex + 1, nextIndex)
  currentItem.children = [...subArray.reduce(arrangeTocByLevels, [])]

  return [...toc, currentItem]
}
