import { type ReactNode } from "react"

import { toKebabCase } from "../helpers/format"

export interface TocItem {
  level: number
  id: string
  text: string
  children: TocItem[]
}

export function transformContentToMdx(content?: string): string | undefined {
  try {
    return content?.startsWith('"') ? (JSON.parse(content) as string) : content
  } catch {
    return content
  }
}

export function generateHeadingId(children: ReactNode): string {
  return toKebabCase(children?.toString() || "")
}

export function extractTocFromContent(content?: string): TocItem[] {
  if (!content) return []

  const regex = /#+[\s\w+]+/g
  const headings = content
    .match(regex)
    ?.map((h) => {
      const text = h.split("# ")[1]
      return {
        text: h.split("# ")[1],
        level: h.split(" ")[0].length,
        id: generateHeadingId(text),
        children: [],
      }
    })
    .filter((h, i) => (i > 0 ? h.level > 1 : true))

  return headings || []
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
