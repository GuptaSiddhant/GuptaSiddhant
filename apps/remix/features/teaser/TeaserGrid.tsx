import { Link } from "@remix-run/react"
import clsx from "clsx"

import Section from "@features/ui/Section"

import type { BaseProps } from "@features/about"
import { type TeaserProps } from "."

export interface TeaserGridProps extends BaseProps {
  teasers: TeaserProps[]
  linkBaseUrl?: string
}

export default function TeaserGrid({
  teasers,
  className,
  linkBaseUrl,
  ...props
}: TeaserGridProps) {
  return (
    <Section {...props} className={clsx(className, "px-4 md:px-10")}>
      <div className="grid min-h-[400px] grid-flow-row-dense auto-rows-fr grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {teasers.map((teaser) => (
          <TeaserGridCard
            key={teaser.id}
            teaser={teaser}
            className={teaser.featured ? "md:col-span-2" : "aspect-square"}
            linkBaseUrl={linkBaseUrl}
          />
        ))}
      </div>
    </Section>
  )
}

function TeaserGridCard({
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
  const iconElement = icon ? (
    <img src={icon} alt={title} className="h-12 rounded object-contain" />
  ) : null

  return (
    <Link
      to={to}
      prefetch="intent"
      className={clsx("group", className)}
      aria-label={title}
    >
      <article
        className={clsx(
          "relative",
          "h-full overflow-hidden rounded-lg",
          "bg-secondary bg-cover bg-center bg-no-repeat",
        )}
        style={{ backgroundImage: `url(${cover})` }}
      >
        <div className="absolute bottom-4 left-4">{iconElement}</div>

        <div
          className={clsx(
            "rounded-lg text-white",
            "h-0 w-full p-4 pl-8 group-hocus:h-full",
            "group-hocus:bg-black/50 group-hocus:backdrop-blur",
            "invisible transition-all group-hocus:visible",
            "flex flex-col items-start justify-center gap-2",
          )}
        >
          {iconElement}
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
