import { type ReactNode } from "react"

import Section from "~/packages/components/Section"

import TeaserFilterSortForm, {
  type TeaserFilterSortFormProps,
} from "./TeaserFilterSortForm"

export interface TeaserHeroProps extends TeaserFilterSortFormProps {
  children: ReactNode
}

export default function TeaserHero({
  children,
  ...props
}: TeaserHeroProps): JSX.Element | null {
  return (
    <Section.Hero>
      <div className="flex flex-col gap-4">{children}</div>

      <TeaserFilterSortForm {...props} />
    </Section.Hero>
  )
}
