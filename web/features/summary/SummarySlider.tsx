import clsx from "clsx"

import { Link } from "@remix-run/react"

import type { BaseProps } from "@gs/types"
import Section, { proseWidth } from "@gs/ui/Section"

import { Sticker } from "./SummaryTimeline/TimelineCard"
import type { SummaryItem } from "./types"

export interface SummarySliderProps extends BaseProps {
  items: SummaryItem[]
  children?: React.ReactNode
  crossSell?: boolean
}

export default function SummarySlider(
  props: SummarySliderProps,
): JSX.Element | null {
  const { children, crossSell, items, ...rest } = props
  if (items.length === 0) return null

  return (
    <Section {...rest}>
      {children ? (
        <header className={clsx("flex w-full flex-col gap-4", proseWidth)}>
          {children}
        </header>
      ) : null}

      <main
        className={clsx(
          "hide-scroll",
          "flex gap-4 sm:gap-10",
          "w-full overflow-auto py-4",
          "snap-x snap-mandatory",
        )}
        style={{ paddingLeft: `max(1rem, calc((100vw - 64ch) / 2))` }}
      >
        {items.map((item) => (
          <SummarySliderCard
            key={item.id}
            className={crossSell ? "" : "sm:h-96"}
            item={item}
          />
        ))}
      </main>
    </Section>
  )
}

function SummarySliderCard({
  item,
  className,
}: {
  item: SummaryItem
  className?: string
}): JSX.Element {
  const { id, title, cover, linkUrl } = item

  return (
    <Link
      to={linkUrl ?? id}
      className="group"
      prefetch="intent"
      aria-label={title}
    >
      <article
        className={clsx(
          className,
          "relative overflow-hidden rounded-lg shadow-xl",
          "bg-secondary bg-cover bg-center bg-no-repeat",
          "aspect-[3/4] h-72",
        )}
        style={{ backgroundImage: `url(${cover})` }}
      >
        <div
          className={clsx(
            "absolute bottom-0 left-0 right-0",
            "bg-gradient-to-t from-gray-900 to-transparent text-white",
            "p-4 transition-[padding] duration-300 group-hocus:py-8",
          )}
        >
          <span className={"text-shadow text-2xl font-bold"}>{title}</span>
        </div>

        <Sticker {...item} />
      </article>
    </Link>
  )
}
