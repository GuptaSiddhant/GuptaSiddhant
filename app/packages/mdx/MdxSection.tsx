import clsx from "clsx"

import Section from "../components/Section"
import { type TocItem } from "./helpers"
import MdxContent from "./MdxContent"
import TableOfContents from "./TableOfContents"

export default function MdxSection({
  mdx,
  toc,
  id = "maincontent",
}: {
  id?: string
  mdx?: string
  toc?: TocItem[]
}): JSX.Element | null {
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
      <aside className={clsx("text-sm", "hidden lg:block")}>
        {toc ? (
          <section className="sticky top-20 overflow-visible">
            <TableOfContents
              toc={toc}
              maxLevel={3}
              highestLevel={toc[0].level}
            />
          </section>
        ) : null}
      </aside>

      <main className="prose prose-invert prose-blockquote:-ml-4 px-4 sm:mx-auto">
        <MdxContent mdx={mdx} />
      </main>
    </Section>
  )
}
