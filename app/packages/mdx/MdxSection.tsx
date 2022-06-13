import clsx from "clsx"

import Section from "../components/Section"
import FloatingTOC from "./FloatingTOC"
import { type TocItem, arrangeTocByLevels } from "./helpers"
import InlineTOC from "./InlineTOC"
import MdxContent from "./MdxContent"

export interface MdxSectionProps {
  id?: string
  mdx?: string
  toc?: TocItem[]
}

export default function MdxSection({
  mdx,
  toc = [],
  id = "main-content",
}: MdxSectionProps): JSX.Element | null {
  if (!mdx) return null

  const arrangedToc = toc.reduce(arrangeTocByLevels, [])
  const tocHighestLevel = arrangedToc[0]?.level || 1

  return (
    <Section
      id={id}
      className={clsx(
        "relative rounded mx-auto md:w-max",
        "md:!grid lg:grid-cols-[200px_auto] xl:grid-cols-[200px_1fr_200px]",
      )}
    >
      <aside className={clsx("text-sm")}>
        {toc ? (
          <section className="sticky top-20 overflow-visible hidden lg:block">
            <InlineTOC
              toc={toc.reduce(arrangeTocByLevels, [])}
              highestLevel={tocHighestLevel}
            />
          </section>
        ) : null}

        <FloatingTOC
          toc={toc}
          highestLevel={tocHighestLevel}
          className="lg:hidden"
        />
      </aside>

      <main className="prose prose-invert prose-blockquote:-ml-4 px-4 sm:mx-auto">
        <MdxContent mdx={mdx} />
      </main>
    </Section>
  )
}
