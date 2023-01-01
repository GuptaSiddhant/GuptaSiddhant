import clsx from "clsx";

import { Link } from "@remix-run/react";

import {
  assetTransformationOptions,
  generateAssetTransformedUrl,
} from "@gs/helpers/assets";
import { getStylingByModelName } from "@gs/models";
import type { BaseProps } from "@gs/types";
import Section from "@gs/ui/Section";

import type { SummaryItem } from "./types";
import SummarySticker from "./SummarySticker";

export interface SummaryGridProps extends BaseProps {
  items: SummaryItem[];
}

export default function SummaryGrid(
  props: SummaryGridProps,
): JSX.Element | null {
  const { items, className, ...rest } = props;
  if (items.length === 0) {
    return null;
  }

  return (
    <Section {...rest} className={clsx(className, "px-4 md:px-10")}>
      <div className="grid min-h-[400px] grid-flow-row-dense auto-rows-fr grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {items.map((item) => (
          <SummaryGridCard key={item.id} item={item} />
        ))}
      </div>
    </Section>
  );
}

function SummaryGridCard({
  item,
  className,
}: {
  item: SummaryItem;
  className?: string;
}): JSX.Element {
  const {
    id,
    title,
    icon,
    cover,
    subtitle,
    description,
    featured,
    linkUrl,
    model,
  } = item;
  const modelStyling = getStylingByModelName(model);
  const showDescription = Boolean(featured && description);
  const href = String(linkUrl ?? id);

  const iconUrl = generateAssetTransformedUrl(
    icon,
    assetTransformationOptions.ICON,
  );
  const imageUrl = generateAssetTransformedUrl(cover, {
    aspectRatio: featured ? 2 : 1,
    height: 400,
  });

  const iconElement = iconUrl ? (
    <img src={iconUrl} alt={title} className="h-12 rounded object-contain" />
  ) : null;

  return (
    <Link
      to={href}
      prefetch="intent"
      className={clsx(
        className,
        "group",
        featured ? "md:col-span-2" : "aspect-square",
      )}
      aria-label={title}
    >
      <article
        className={clsx(
          "relative",
          "h-full overflow-hidden rounded-lg",
          "bg-secondary bg-cover bg-center bg-no-repeat",
          modelStyling.text,
        )}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute bottom-4 left-4">{iconElement}</div>

        <div
          className={clsx(
            "rounded-lg text-white",
            "h-0 w-full p-4 pl-8 group-hocus:h-full",
            "group-hocus:bg-black/50 group-hocus:backdrop-blur",
            "invisible transition-all group-hocus:visible",
            "flex flex-col items-start justify-center gap-2",
          )}
        >
          {iconElement}
          <strong className="white text-2xl font-bold">{title}</strong>
          {subtitle ? <p className="white font-semibold">{subtitle}</p> : null}
          {showDescription ? (
            <p className="white hidden text-base italic sm:block">
              {description}
            </p>
          ) : null}
        </div>

        <SummarySticker {...item} />
      </article>
    </Link>
  );
}
