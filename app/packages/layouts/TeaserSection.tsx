import clsx from "clsx"

import { Link } from "@gs/components/Link"
import Section, { proseWidth } from "./Section"
import type { TeaserProps } from "@gs/types"

export interface TeaserSectionProps {
  id?: string
  items: TeaserProps[]
  children?: React.ReactNode
  linkBaseUrl: string
  className?: string
  crossSell?: boolean
}

export default function TeaserSection({
  id,
  items,
  children,
  linkBaseUrl,
  className,
  crossSell,
}: TeaserSectionProps): JSX.Element | null {
  if (items?.length === 0) return null

  return (
    <Section id={id}>
      {children ? (
        <div className={clsx("flex flex-col gap-4 w-full", proseWidth)}>
          {children}
        </div>
      ) : null}

      <ul
        className={clsx(
          className,
          "flex gap-4 sm:gap-10",
          "w-full overflow-auto py-4",
          "snap-x snap-mandatory",
        )}
        style={{
          paddingLeft: `calc((100vw - 64ch) / 2)`,
        }}
      >
        {items.map((item) => (
          <TeaserCard
            {...item}
            linkBaseUrl={linkBaseUrl}
            small={crossSell}
            key={item.id}
          />
        ))}
      </ul>
    </Section>
  )
}

// Teaser Card

interface TeaserCardProps extends TeaserProps {
  linkBaseUrl: string
  className?: string
  small?: boolean
}

function TeaserCard({
  id,
  title,
  cover,
  linkBaseUrl,
  className,
  small,
}: TeaserCardProps): JSX.Element {
  return (
    <Link to={linkBaseUrl + id} className="group" prefetch="intent">
      <li
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
            "bg-gradient-to-t from-gray-900",
            "p-4 transition-[padding] duration-300 group-hover:py-8 group-focus:py-8",
          )}
        >
          <span className={"text-shadow text-2xl font-bold"}>{title}</span>
        </div>
      </li>
    </Link>
  )
}
