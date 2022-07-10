import { type ReactNode } from "react"

import Hero from "~/features/hero"

import TeaserFilterSortForm, {
  type TeaserFilterSortFormProps,
} from "./TeaserFilterSortForm"

export interface TeaserHeroProps extends TeaserFilterSortFormProps {
  children?: ReactNode
  title: string
  subtitle?: string
}

export default function TeaserHero({
  children,
  title,
  subtitle,
  ...props
}: TeaserHeroProps): JSX.Element | null {
  return (
    <Hero>
      <Hero.Header title={title} subtitle={subtitle} />
      <Hero.Description>
        {children}
        <TeaserFilterSortForm {...props} />
      </Hero.Description>
    </Hero>
  )
}