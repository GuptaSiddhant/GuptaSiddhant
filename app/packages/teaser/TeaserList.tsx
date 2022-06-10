import { Link } from "@remix-run/react"
import clsx from "clsx"

import Section from "~/packages/components/Section"

import type { BaseProps } from "../types"
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
      <div className="flex flex-col gap-10">
        {teasers.map((teaser) => (
          <TeaserListCard
            key={teaser.id}
            teaser={teaser}
            linkBaseUrl={linkBaseUrl}
            className="h-80"
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
  const { id, title, icon, cover, subtitle, description, featured } = teaser
  const showDescription = Boolean(featured && description)
  const to = linkBaseUrl ? `${linkBaseUrl}${id}` : id

  return (
    <Link to={to} prefetch="intent" className={clsx("group", className)}>
      <article
        className={clsx(
          "relative",
          "h-full overflow-hidden rounded-lg",
          "bg-secondary bg-cover bg-center bg-no-repeat",
        )}
        style={{ backgroundImage: `url(${cover})` }}
      >
        {icon ? (
          <div className="absolute bottom-4 left-4">
            <img
              src={icon}
              alt={title}
              className="h-12 rounded object-contain"
            />
          </div>
        ) : null}
        <div
          className={clsx(
            "rounded-lg",
            "h-0 w-full p-4 pl-8 group-hocus:h-full",
            "group-hocus:bg-tertiary/50 group-hocus:backdrop-blur",
            "invisible transition-all  group-hocus:visible",
            "flex flex-col items-start justify-center gap-2",
          )}
        >
          {icon ? (
            <img
              src={icon}
              alt={title}
              className="mb-2 h-12 rounded object-contain"
            />
          ) : null}
          <strong className="white text-2xl font-bold">{title}</strong>
          {subtitle ? <p className="white font-semibold">{subtitle}</p> : null}
          {showDescription ? (
            <p className="white hidden text-base italic sm:block">
              {description}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  )
}
