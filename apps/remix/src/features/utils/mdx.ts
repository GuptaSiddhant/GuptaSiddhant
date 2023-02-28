import type { ReactNode } from "react";

import { DEFAULT_TOC_MAX_LEVEL } from "@gs/constants";
import { type TocItem } from "@gs/ui/TableOfContent/helpers";
import { toKebabCase } from "@gs/utils/format";

export function generateHeadingId(children: ReactNode): string {
  return toKebabCase(children?.toString() || "");
}

export function extractTocFromMdx(
  mdx?: string,
  maxLevel: number = DEFAULT_TOC_MAX_LEVEL,
): TocItem[] {
  if (!mdx) {
    return [];
  }

  const regex = /#+.+/g;
  const headings = mdx
    .match(regex)
    ?.map((h) => {
      const text = h.split("# ")[1];
      return {
        text: h.split("# ")[1],
        level: h.split(" ")[0].length,
        id: generateHeadingId(text),
        children: [],
      };
    })
    .filter((h, i) => (i > 0 ? h.level > 1 : true))
    .filter((h) => h.level <= maxLevel);

  return headings || [];
}

export function transformContentToMdx(content?: string): string | undefined {
  try {
    return content?.startsWith('"') ? (JSON.parse(content) as string) : content;
  } catch {
    return content;
  }
}
