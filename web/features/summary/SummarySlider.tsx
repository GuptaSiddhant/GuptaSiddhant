import clsx from "clsx"
import { useRef } from "react"
import ArrowLeftIcon from "remixicon-react/ArrowLeftCircleLineIcon"
import ArrowRightIcon from "remixicon-react/ArrowRightCircleLineIcon"

import { Link } from "@remix-run/react"

import useElementStore from "@gs/hooks/useElementStore"
import { ScrollDirection, useScrollElement } from "@gs/hooks/useScroll"
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

  const elementRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLElement>(null)

  const cardWidth = useElementStore(
    cardRef,
    "load",
    () => (cardRef.current?.getBoundingClientRect().width || 0) + 10,
    () => 0,
  )

  if (items.length === 0) return null

  return (
    <Section {...rest}>
      {children ? (
        <header className={clsx("flex w-full flex-col gap-4", proseWidth)}>
          {children}
        </header>
      ) : null}

      <main className="relative">
        <div
          ref={elementRef}
          className={clsx(
            "flex gap-4 sm:gap-10",
            "w-full overflow-auto py-4",
            "hide-scroll snap-x snap-mandatory",
          )}
          style={{ paddingLeft: `max(1rem, calc((100vw - 64ch) / 2))` }}
        >
          {items.map((item) => (
            <SummarySliderCard
              key={item.id}
              className={crossSell ? "" : "sm:h-96"}
              item={item}
              cardRef={cardRef}
            />
          ))}
        </div>

        <SummarySliderOverlay
          sliderRef={elementRef}
          scrollByDistance={cardWidth}
          direction="left"
        >
          <ArrowLeftIcon size={48} />
        </SummarySliderOverlay>

        <SummarySliderOverlay
          sliderRef={elementRef}
          scrollByDistance={cardWidth}
          direction="right"
        >
          <ArrowRightIcon size={48} />
        </SummarySliderOverlay>
      </main>
    </Section>
  )
}

function SummarySliderOverlay({
  direction,
  scrollByDistance,
  sliderRef,

  children,
}: {
  direction: "right" | "left"
  scrollByDistance: number
  sliderRef: React.RefObject<HTMLElement>

  children: React.ReactNode
}): JSX.Element {
  const { scrollDistanceRatio, isScrollCompleted, isScrollStarted } =
    useScrollElement(sliderRef, {
      direction: ScrollDirection.HORIZONTAL,
    })

  const isNext = direction === "right"

  return (
    <button
      data-direction={direction}
      role="presentation"
      className={clsx(
        "absolute top-0 bottom-0 z-[1]",
        "from-inverse to-transparent",
        isNext ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r",
      )}
      style={{
        width: `calc(8vw * ${
          isNext ? 1 - scrollDistanceRatio : scrollDistanceRatio
        })`,
      }}
      onClick={() =>
        sliderRef.current?.scrollBy({
          behavior: "smooth",
          left: scrollByDistance * (isNext ? 1 : -1),
        })
      }
    >
      <div
        className={clsx(
          "absolute",
          isNext ? "right-1" : "left-1",
          isNext ? isScrollCompleted && "hidden" : !isScrollStarted && "hidden",
        )}
      >
        {children}
      </div>
    </button>
  )
}

function SummarySliderCard({
  item,
  className,
  cardRef,
}: {
  item: SummaryItem
  className?: string
  cardRef?: React.RefObject<HTMLElement>
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
        ref={cardRef}
        className={clsx(
          className,
          "relative overflow-hidden rounded-lg shadow-xl",
          "bg-secondary bg-cover bg-center bg-no-repeat",
          "aspect-[3/4] h-72 snap-center",
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
