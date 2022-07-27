import clsx from "clsx"

import { Link } from "@remix-run/react"

import type { BaseProps } from "@gs/types"
import Reader from "@gs/ui/Reader"
import { proseWidth } from "@gs/ui/Section"
import { Caption } from "@gs/ui/Text"

import type { SummaryItem } from "../types"
import { createTimeline } from "./timeline-helpers"
import SummaryTimelineCard from "./TimelineCard"

export interface SummaryTimelineProps extends BaseProps {
  items: SummaryItem[]
}

export default function SummaryTimeline(
  props: SummaryTimelineProps,
): JSX.Element | null {
  const { items, className, ...rest } = props
  if (items.length === 0) return null

  const timeline = createTimeline(items)

  return (
    <Reader
      {...rest}
      className={clsx(
        proseWidth,
        "md:!min-w-0",
        "flex w-full flex-col gap-12 border-l border-divider py-12 pl-4",
      )}
      //   rightColumn={<TableOfContent toc={toc} />}
      //   leftColumn={
      //     <LifelineFilter
      //       tags={tags}
      //       selectedTags={selectedTags}
      //       selectedCategory={selectedCategory}
      //     />
      //   }
    >
      {timeline.map((item) => {
        if ("model" in item)
          return <SummaryTimelineCard key={item.id} item={item} />

        return <TimelineDivider key={item.id} {...item} />
      })}
    </Reader>
  )
}

interface TimelineDividerProps {
  id: string
  type: "year"
  children: React.ReactNode
}

function TimelineDivider({
  id,
  type,
  children,
}: TimelineDividerProps): JSX.Element | null {
  if (type === "year") {
    const linkId = id

    return (
      <Link
        to={{ hash: linkId }}
        id={linkId}
        className="scroll-mt-20 no-underline"
      >
        <Caption className="relative">
          {children}
          <div
            role="presentation"
            className={clsx(
              "absolute -left-6 top-2 h-4 w-4 rounded-full bg-inverse",
            )}
          />
        </Caption>
      </Link>
    )
  }

  return null
}
