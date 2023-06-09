import clsx from "clsx";
import { useRef } from "react";

import BlurImg from "@gs/ui/BlurImg";
import {
  assetTransformationOptions,
  generateAssetTransformedUrl,
} from "@gs/utils/asset-transformer";

export interface HeroImageProps {
  src?: string;
  icon?: string;
  alt?: string;
  caption?: string;
  hash?: string;
}

export default function HeroImage({
  alt,
  caption,
  icon,
  src,
  hash,
}: HeroImageProps): JSX.Element | null {
  const figureRef = useRef<HTMLElement>(null);

  if (!src) return null;

  const iconUrl = generateAssetTransformedUrl(
    icon,
    assetTransformationOptions.ICON,
  );
  const imageUrl = generateAssetTransformedUrl(src);

  return (
    <figure
      ref={figureRef}
      className={clsx(
        "relative rounded-md",
        "mx-4 -w-full-m4 md:mx-8 md:-w-full-m8",
        "md:aspect-video md:max-h-screen",
      )}
    >
      <BlurImg
        src={imageUrl}
        alt={alt || ""}
        hash={hash}
        parentRef={figureRef}
      />
      {caption ? (
        <figcaption className="py-2 text-sm text-tertiary">
          {caption}
        </figcaption>
      ) : null}
      {iconUrl ? (
        <img
          key={iconUrl}
          src={iconUrl}
          alt={alt ? `${alt} icon` : undefined}
          className="absolute top-4 left-4 mb-2 h-12 rounded-md object-contain"
          loading="eager"
        />
      ) : null}
    </figure>
  );
}
