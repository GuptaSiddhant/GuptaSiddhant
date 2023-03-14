import { DEFAULT_TOC_MAX_LEVEL } from "@gs/constants";
import { type TocItem } from "@gs/ui/TableOfContent/types";
import { toKebabCase } from "@gs/utils/format";

export function generateHeadingId(children: string | number): string {
  return toKebabCase(children.toString());
}

export function transformContentToMdx(content?: string): string | undefined {
  if (!content) return undefined;

  try {
    return content.startsWith('"') ? (JSON.parse(content) as string) : content;
  } catch {
    return content;
  }
}

export function extractTocFromMdx(
  mdx?: string,
  maxLevel: number = DEFAULT_TOC_MAX_LEVEL,
): TocItem[] {
  const headings = mdx?.match(/#+.+/g) || [];

  return headings
    .map(mapHeadingTextToTocItem)
    .filter((h, i) => (i > 0 ? h.level > 1 : true) && h.level <= maxLevel);
}

function mapHeadingTextToTocItem(heading: string): TocItem {
  const text = heading.split("# ")[1];

  return {
    text: heading.split("# ")[1],
    level: heading.split(" ")[0].length,
    id: generateHeadingId(text),
    children: [],
  };
}
