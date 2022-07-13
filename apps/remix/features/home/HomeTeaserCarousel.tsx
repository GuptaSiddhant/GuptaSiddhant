import {
  type HeroHeaderCaptionIconType,
  HeroHeaderCaption,
} from "@features/hero/HeroHeader"
import { type TeaserProps } from "@features/teaser"
import TeaserCarousel from "@features/teaser/TeaserCarousel"
import { InternalLink } from "@features/ui/Link"
import { H2 } from "@features/ui/Text"

export interface HomeTeaserCarouselProps {
  caption: string
  children: React.ReactNode
  id: string
  linkText?: string
  teasers: TeaserProps[]
  icon?: HeroHeaderCaptionIconType
}

export default function HomeTeaserCarousel({
  id,
  teasers,
  caption,
  children,
  linkText,
  icon = "hash",
}: HomeTeaserCarouselProps) {
  return (
    <TeaserCarousel id={id} teasers={teasers} linkBaseUrl={`/${id}/`}>
      <HeroHeaderCaption
        caption={{
          label: caption,
          to: `#${id}`,
          icon,
        }}
      />

      <H2 className="!p-0">{children}</H2>

      {linkText ? <InternalLink to={`/${id}/`}>{linkText}</InternalLink> : null}
    </TeaserCarousel>
  )
}
