import {
  type HeroHeaderCaptionIconType,
  HeroHeaderCaption,
} from "@gs/hero/HeroHeader"
import { type TeaserProps } from "@gs/teaser"
import TeaserCarousel from "@gs/teaser/TeaserCarousel"
import { InternalLink } from "@gs/ui/Link"
import { H2 } from "@gs/ui/Text"

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
