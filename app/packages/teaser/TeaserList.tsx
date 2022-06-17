import { Link } from "@remix-run/react"
import clsx from "clsx"

import Section from "~/packages/ui/Section"

import { formatDate } from "../helpers/format"
import type { BaseProps } from "../types"
import Img from "../ui/Img"
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
          "relative md:-mx-4 rounded-lg h-full",
          "bg-default group-hover:bg-secondary group-focus:bg-secondary",
          "grid overflow-clip grid-cols-1 grid-rows-[150px_auto] md:grid-cols-[250px_1fr] md:grid-rows-none",
        )}
      >
        <aside className={clsx("w-full h-full self-stretch overflow-hidden")}>
          {cover ? (
            <Img
              src={cover}
              alt={title}
              className={clsx(
                "object-cover w-full h-full",
                "transition-transform duration-300",
                "group-hover:scale-105 group-focus:scale-105",
              )}
            />
          ) : null}
        </aside>

        <main className="p-4 flex-1 self-center">
          <div className="font-bold text-xl my-2">{title}</div>
          {subtitle ? (
            <div className="italic text-base text-secondary">{subtitle}</div>
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
              <span className="text-link whitespace-nowrap">
                {"Read post >"}
              </span>
            </div>
          )}
        </main>
      </article>
    </Link>
  )
}
