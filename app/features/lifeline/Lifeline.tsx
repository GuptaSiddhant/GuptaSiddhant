import clsx from "clsx"

import type { TocItem } from "~/features/helpers/table-of-contents"
import Reader from "~/features/ui/Reader"
import { proseWidth } from "~/features/ui/Section"

import TableOfContent from "../ui/TableOfContent"
import type { LifeLineItems } from "."
import CareerCard from "./CareerCard"
import { LifelineContextProvider } from "./context"
import EducationCard from "./EducationCard"
import LifelineDivider from "./LifelineDivider"

export interface LifelineProps {
  lifeline: LifeLineItems
  toc?: TocItem[]
}

export default function Lifeline({
  lifeline,
  toc = [],
}: LifelineProps): JSX.Element | null {
  return (
    <LifelineContextProvider>
      <Reader
        id="lifeline"
        className={clsx(
          proseWidth,
          "flex w-full flex-col gap-12 border-l border-divider py-12 pl-4",
        )}
        rightColumn={<TableOfContent toc={toc} />}
      >
        {lifeline.map((item) => {
          if ("degree" in item) return <EducationCard key={item.id} {...item} />
          if ("position" in item) return <CareerCard key={item.id} {...item} />
          return <LifelineDivider key={item.id} {...item} />
        })}
      </Reader>
    </LifelineContextProvider>
  )
}
