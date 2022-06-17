import clsx from "clsx"

import type { BaseProps } from "~/features/types"

import Section, { proseWidth } from "../Section"
import HeroDescription from "./HeroDescription"
import HeroHeader from "./HeroHeader"
import HeroImage from "./HeroImage"

export default function Hero({
  className,
  prose,
  ...props
}: BaseProps & { prose?: boolean }): JSX.Element | null {
  return (
    <Section
      id="hero"
      {...props}
      className={clsx(
        className,
        "mt-[10vh] text-tertiary",
        prose && proseWidth,
      )}
    />
  )
}

Hero.Header = HeroHeader
Hero.Description = HeroDescription
Hero.Image = HeroImage
