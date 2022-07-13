import type { BaseProps } from "@gs/types"
import Img from "@gs/ui/Img"
import Section from "@gs/ui/Section"
import { formatDate } from "@gs/utils/format"
import { Link } from "@remix-run/react"
import clsx from "clsx"

import { type TeaserProps } from "."

export interface TeaserGridProps extends BaseProps {
  teasers: TeaserProps[]
  linkBaseUrl?: string
}

export default function TeaserList({
  teasers,
  className,
  linkBaseUrl,
  ...props
}: TeaserGridProps) {
  return (
    <Section.Prose {...props} className={clsx(className)}>
      <div className="grid auto-rows-fr gap-10">
        {teasers.map((teaser) => (
          <TeaserListCard
            key={teaser.id}
            teaser={teaser}
            linkBaseUrl={linkBaseUrl}
          />
        ))}
      </div>
    </Section.Prose>
  )
}

function TeaserListCard({
  teaser,
  className,
  linkBaseUrl,
}: {
  teaser: TeaserProps
  className?: string
  linkBaseUrl?: string
}): JSX.Element {
  const { id, title, subtitle, description, date, cover } = teaser
  const to = linkBaseUrl ? `${linkBaseUrl}${id}` : id

  return (
    <Link
      to={to}
      prefetch="intent"
      className={clsx("group h-full")}
      aria-label={title}
    >
      <article
        className={clsx(
          className,
          "relative h-full rounded-lg md:-mx-4",
          "bg-default group-hover:bg-secondary group-focus:bg-secondary",
          "grid grid-cols-1 grid-rows-[150px_auto] overflow-clip md:grid-cols-[250px_1fr] md:grid-rows-none",
        )}
      >
        <aside className={clsx("h-full w-full self-stretch overflow-hidden")}>
          {cover ? (
            <Img
              src={cover}
              alt={title}
              className={clsx(
                "h-full w-full object-cover",
                "transition-transform duration-300",
                "group-hover:scale-105 group-focus:scale-105",
              )}
            />
          ) : null}
        </aside>

        <main className="flex-1 self-center p-4">
          <div className="my-2 text-xl font-bold">{title}</div>
          {subtitle ? (
            <div className="text-base italic text-secondary">{subtitle}</div>
          ) : null}
          {date ? (
            <time dateTime={date} className="text-sm text-tertiary">
              {formatDate(date)}
            </time>
          ) : null}

          {teaser ? null : (
            <div className="mt-4 text-base">
              {description ? (
                <span className="text-tertiary">{description} </span>
              ) : null}
              <span className="whitespace-nowrap text-link">
                {"Read post >"}
              </span>
            </div>
          )}
        </main>
      </article>
    </Link>
  )
}
