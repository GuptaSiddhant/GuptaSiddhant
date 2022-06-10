import { type ReactNode } from "react"

import Hero from "~/packages/components/Hero"

import TeaserFilterSortForm, {
  type TeaserFilterSortFormProps,
} from "./TeaserFilterSortForm"

export interface TeaserHeroProps extends TeaserFilterSortFormProps {
  children?: ReactNode
}

export default function TeaserHero({
  children,
  ...props
}: TeaserHeroProps): JSX.Element | null {
  return (
    <Hero>
      {children ? (
        <header className="flex flex-col gap-4">{children}</header>
      ) : null}

      <TeaserFilterSortForm {...props} />
    </Hero>
  )
}
