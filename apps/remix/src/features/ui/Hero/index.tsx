import clsx from "clsx";

import type { BaseProps } from "@gs/types";
import Section, { proseWidth } from "@gs/ui/Section";

import HeroDescription from "./HeroDescription";
import HeroHeader from "./HeroHeader";
import HeroImage from "./HeroImage";

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
  );
}

Hero.Header = HeroHeader;
Hero.Description = HeroDescription;
Hero.Image = HeroImage;

export type { HeroDescriptionProps } from "./HeroDescription";
export type { HeroHeaderProps } from "./HeroHeader";
export type { HeroImageProps } from "./HeroImage";
