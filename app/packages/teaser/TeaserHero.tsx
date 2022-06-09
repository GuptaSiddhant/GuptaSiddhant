import { type ReactNode } from "react"

import Section from "~/packages/components/Section"

import TeaserFilterSortForm, {
  type TeaserFilterSortFormProps,
} from "./TeaserFilterSortForm"

export interface TeaserHeroProps extends TeaserFilterSortFormProps {
  children: ReactNode
  teasersCount: number
}

export default function TeaserHero({
  children,
  teasersCount,
  ...props
}: TeaserHeroProps): JSX.Element | null {
  return (
    <Section.Hero>
      <div className="flex flex-col gap-4">{children}</div>

      {teasersCount > 1 ? <TeaserFilterSortForm {...props} /> : null}
    </Section.Hero>
  )
}
