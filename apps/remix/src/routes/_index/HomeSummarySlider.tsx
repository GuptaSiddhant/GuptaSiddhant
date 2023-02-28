import type { SummaryItem } from "@gs/summary";
import SummarySlider from "@gs/summary/SummarySlider";
import type { MaybePromise } from "@gs/types";
import {
  HeroHeaderCaption,
  type HeroHeaderCaptionIconType,
} from "@gs/ui/Hero/HeroHeader";
import { InternalLink } from "@gs/ui/Link";
import { H2 } from "@gs/ui/Text";

export interface HomeSummarySliderProps {
  caption: string;
  children: React.ReactNode;
  id: string;
  linkText?: string;
  items: MaybePromise<SummaryItem[]>;
  icon?: HeroHeaderCaptionIconType;
  showCardSubtitle?: boolean;
}

export default function HomeSummarySlider({
  id,
  items,
  caption,
  children,
  linkText,
  icon = "hash",
  showCardSubtitle,
}: HomeSummarySliderProps) {
  return (
    <SummarySlider id={id} items={items} showCardSubtitle={showCardSubtitle}>
      <HeroHeaderCaption
        caption={{
          label: caption,
          to: `#${id}`,
          icon,
        }}
      />

      <H2 className="!p-0">{children}</H2>

      {linkText ? <InternalLink to={`/${id}/`}>{linkText}</InternalLink> : null}
    </SummarySlider>
  );
}
