import clsx from "clsx"

import type { BaseProps } from "~/packages/types"

import Section from "../Section"
import HeroDescription from "./HeroDescription"
import HeroHeader from "./HeroHeader"
import HeroImage from "./HeroImage"

export default function Hero({
  className,
  ...props
}: BaseProps): JSX.Element | null {
  return (
    <Section
      id="hero"
      {...props}
      className={clsx(className, "mt-[10vh] text-tertiary")}
    />
  )
}

Hero.Header = HeroHeader
Hero.Description = HeroDescription
Hero.Image = HeroImage
