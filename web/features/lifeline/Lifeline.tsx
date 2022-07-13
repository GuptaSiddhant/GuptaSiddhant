import type { TocItem } from "@gs/helpers/table-of-contents"
import Reader from "@gs/ui/Reader"
import { proseWidth } from "@gs/ui/Section"
import TableOfContent from "@gs/ui/TableOfContent"
import clsx from "clsx"

import type { LifeLineCategory, LifeLineItems } from "."
import { LifelineContextProvider } from "./context"
import ExperienceCard from "./ExperienceCard"
import LifelineDivider from "./LifelineDivider"
import LifelineFilter from "./LifelineFilter"

export interface LifelineProps {
  lifeline: LifeLineItems
  toc?: TocItem[]
  tags?: string[]
  selectedTags?: string[]
  selectedCategory: LifeLineCategory
}

export default function Lifeline({
  lifeline,
  toc = [],
  tags = [],
  selectedTags = [],
  selectedCategory,
}: LifelineProps): JSX.Element | null {
  return (
    <LifelineContextProvider>
      <Reader
        id="lifeline"
        className={clsx(
          proseWidth,
          "md:!min-w-0",
          "flex w-full flex-col gap-12 border-l border-divider py-12 pl-4",
        )}
        rightColumn={<TableOfContent toc={toc} />}
        leftColumn={
          <LifelineFilter
            tags={tags}
            selectedTags={selectedTags}
            selectedCategory={selectedCategory}
          />
        }
      >
        {lifeline.map((item) => {
          if ("category" in item)
            return <ExperienceCard key={item.id} {...item} />

          return <LifelineDivider key={item.id} {...item} />
        })}
      </Reader>
    </LifelineContextProvider>
  )
}
