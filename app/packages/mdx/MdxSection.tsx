import clsx from "clsx"
import { useMemo } from "react"

import Section from "../components/Section"
import { arrangeTocByLevels, type TocItem } from "./helpers"
import MdxContent from "./MdxContent"
import TableOfContents from "./TableOfContents"
import FloatingTOC from "./FloatingTOC"

export default function MdxSection({
  mdx,
  toc,
  id = "maincontent",
}: {
  id?: string
  mdx?: string
  toc?: TocItem[]
}): JSX.Element | null {
  const arrangedToc = useMemo(
    () => (toc || [])?.reduce(arrangeTocByLevels, []),
    [toc],
  )
  if (!mdx) return null

  return (
    <Section
      id={id}
      className={clsx(
        "relative rounded mx-auto md:w-max",
        "md:!grid lg:grid-cols-[200px_auto] xl:grid-cols-[200px_1fr_200px]",
        "border-b-[1px] border-gray-700",
      )}
    >
      <aside className={clsx("text-sm")}>
        {toc ? (
          <section className="sticky top-20 overflow-visible hidden lg:block">
            <TableOfContents
              toc={arrangedToc}
              maxLevel={3}
              highestLevel={toc[0].level}
            />
          </section>
        ) : null}

        <FloatingTOC
          toc={toc}
          maxLevel={3}
          highestLevel={toc?.[0].level || 1}
        />
      </aside>

      <main className="prose prose-invert prose-blockquote:-ml-4 px-4 sm:mx-auto">
        <MdxContent mdx={mdx} />
      </main>
    </Section>
  )
}
