import FloatingTableOfContent from "./FloatingToc";
import InlineTableOfContent from "./InlineToc";
import { arrangeTocByLevels, useCurrentActiveId } from "./helpers";
import { TocItem } from "./types";

export default function TableOfContent({ toc = [] }: { toc: TocItem[] }) {
  const activeId = useCurrentActiveId(toc);

  if (toc.length === 0) {
    return null;
  }

  const arrangedToc = toc.reduce(arrangeTocByLevels, []);
  const tocHighestLevel = arrangedToc[0]?.level || 1;

  return (
    <>
      <InlineTableOfContent
        toc={arrangedToc}
        highestLevel={tocHighestLevel}
        activeId={activeId}
        className="hidden px-8 lg:block"
      />

      <FloatingTableOfContent
        toc={toc}
        highestLevel={tocHighestLevel}
        className="lg:hidden"
        activeId={activeId}
      />
    </>
  );
}

export type { TocItem };
