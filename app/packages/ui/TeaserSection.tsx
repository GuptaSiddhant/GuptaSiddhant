import clsx from "clsx"

import Section, { proseWidth } from "~/packages/components/Section"
import TeaserCard from "~/packages/components/TeaserCard"
import type { TeaserProps } from "~/packages/helpers/teaser"

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
