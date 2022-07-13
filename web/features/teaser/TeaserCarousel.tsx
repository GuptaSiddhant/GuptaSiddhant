import type { TeaserProps } from "@gs/teaser"
import { Link } from "@gs/ui/Link"
import Section, { proseWidth } from "@gs/ui/Section"
import clsx from "clsx"

export interface TeaserCarouselProps {
  id?: string
  teasers: TeaserProps[]
  children?: React.ReactNode
  linkBaseUrl: string
  className?: string
  crossSell?: boolean
}

export default function TeaserCarousel({
  id,
  teasers,
  children,
  linkBaseUrl,
  className,
  crossSell,
}: TeaserCarouselProps): JSX.Element | null {
  if (teasers?.length === 0) return null

  return (
    <Section id={id} className={className}>
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
        {teasers.map((item) => (
          <TeaserCarouselCard
            {...item}
            linkBaseUrl={linkBaseUrl}
            small={crossSell}
            key={item.id}
          />
        ))}
      </main>
    </Section>
  )
}

export interface TeaserCardProps extends TeaserProps {
  linkBaseUrl: string
  className?: string
  small?: boolean
}

function TeaserCarouselCard({
  id,
  title,
  cover,
  linkBaseUrl,
  className,
  small,
}: TeaserCardProps): JSX.Element {
  return (
    <Link
      to={linkBaseUrl + id}
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
          small ? "" : "sm:h-96",
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
      </article>
    </Link>
  )
}
