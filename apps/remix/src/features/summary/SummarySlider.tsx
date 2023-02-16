import { Await, Link } from "@remix-run/react";
import clsx from "clsx";
import { Suspense, useCallback, useRef } from "react";
import type { RemixiconReactIconComponentType } from "remixicon-react";
import ArrowLeftIcon from "remixicon-react/ArrowLeftCircleLineIcon";
import ArrowRightIcon from "remixicon-react/ArrowRightCircleLineIcon";

import { generateAssetTransformedUrl } from "@gs/helpers/assets";
import useElementStore from "@gs/hooks/useElementStore";
import { ScrollDirection, useScrollElement } from "@gs/hooks/useScroll";
import type { BaseProps, MaybePromise } from "@gs/types";
import Section, { proseWidth } from "@gs/ui/Section";

import SummarySticker from "./SummarySticker";
import type { SummaryItem } from "./types";

export interface SummarySliderProps extends BaseProps {
  items: MaybePromise<SummaryItem[]>;
  children?: React.ReactNode;
  crossSell?: boolean;
  showCardSubtitle?: boolean;
}

export default function SummarySlider({
  children,
  showCardSubtitle,
  ...props
}: SummarySliderProps): JSX.Element | null {
  return (
    <Section {...props}>
      {children ? (
        <header className={clsx("flex w-full flex-col gap-4", proseWidth)}>
          {children}
        </header>
      ) : null}

      <Suspense fallback={<span>Loading...</span>}>
        <Await
          resolve={props.items}
          errorElement={<span>No items are available.</span>}
        >
          {(items) => (
            <SummarySliderScrollArea
              {...props}
              items={items}
              showCardSubtitle={showCardSubtitle}
            />
          )}
        </Await>
      </Suspense>
    </Section>
  );
}

function SummarySliderScrollArea(
  props: Pick<SummarySliderProps, "crossSell" | "showCardSubtitle"> & {
    items: SummaryItem[];
  },
) {
  const { crossSell, items, showCardSubtitle } = props;

  const sliderRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  const cardWidth = useElementStore(
    cardRef,
    "load",
    () => (cardRef.current?.getBoundingClientRect().width || 0) + 10,
    () => 0,
  );

  const { scrollDistanceRatio, isScrollCompleted, isScrollStarted } =
    useScrollElement(sliderRef, {
      direction: ScrollDirection.HORIZONTAL,
    });

  const scrollSliderByCardWidth = useCallback(
    (next: boolean) =>
      sliderRef.current?.scrollBy({
        behavior: "smooth",
        left: cardWidth * (next ? 1 : -1),
      }),
    [cardWidth],
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <main className="relative">
      <div
        ref={sliderRef}
        className={clsx(
          "flex gap-4 sm:gap-8",
          "w-full overflow-auto p-8 pt-4",
          "hide-scroll snap-x snap-mandatory",
        )}
        style={{ paddingInline: "max(1rem, calc((100vw - 64ch) / 2))" }}
      >
        {items.map((item) => (
          <SummarySliderCard
            key={item.id}
            className={crossSell ? "" : "sm:h-96"}
            item={item}
            cardRef={cardRef}
            showSubtitle={showCardSubtitle}
          />
        ))}
      </div>

      <SummarySliderButtonOverlay
        direction="previous"
        isDisabled={!isScrollStarted}
        scrollDistanceRatio={scrollDistanceRatio}
        scrollSlider={scrollSliderByCardWidth}
        Icon={ArrowLeftIcon}
      />
      <SummarySliderButtonOverlay
        direction="next"
        isDisabled={isScrollCompleted}
        scrollDistanceRatio={1 - scrollDistanceRatio}
        scrollSlider={scrollSliderByCardWidth}
        Icon={ArrowRightIcon}
      />
    </main>
  );
}

function SummarySliderCard({
  item,
  className,
  cardRef,
  showSubtitle,
}: {
  item: SummaryItem;
  className?: string;
  cardRef?: React.RefObject<HTMLElement>;
  showSubtitle?: boolean;
}): JSX.Element {
  const { id, title, cover, linkUrl, subtitle, icon } = item;
  const imageSrc = generateAssetTransformedUrl(cover, {
    aspectRatio: 3 / 4,
    height: 400,
  });

  return (
    <Link
      to={linkUrl ?? id}
      className="group"
      prefetch="intent"
      aria-label={title}
    >
      <article
        ref={cardRef}
        className={clsx(
          className,
          "relative overflow-hidden rounded-lg shadow-xl",
          "aspect-[3/4] h-72 snap-center bg-secondary",
        )}
      >
        <img
          src={imageSrc || icon}
          alt={title}
          loading="lazy"
          className={clsx(
            "absolute inset-0 w-full h-full object-cover",
            imageSrc
              ? "transition-[filter] duration-300 group-hocus:blur-sm"
              : "blur-md",
          )}
        />

        <div
          className={clsx(
            "absolute bottom-0 left-0 right-0",
            "bg-gradient-to-t from-gray-900 to-transparent text-white",
            "p-4 transition-[padding] duration-300 group-hocus:py-8",
          )}
        >
          <span className={"text-shadow block text-2xl font-bold"}>
            {title}
          </span>

          <span
            className={clsx(
              "text-shadow text-lg font-bold",
              showSubtitle
                ? "block"
                : "hidden opacity-50 transition-opacity duration-300 group-hocus:block group-hocus:opacity-100 ",
            )}
          >
            {subtitle}
          </span>
        </div>

        <SummarySticker {...item} />
      </article>
    </Link>
  );
}

interface SummarySliderButtonOverlayProps {
  direction: "next" | "previous";
  scrollDistanceRatio: number;
  isDisabled: boolean;
  scrollSlider: (isNext: boolean) => void;
  Icon: RemixiconReactIconComponentType;
}

function SummarySliderButtonOverlay({
  direction,
  scrollDistanceRatio,
  scrollSlider,
  isDisabled,
  Icon,
}: SummarySliderButtonOverlayProps): JSX.Element {
  const isNext = direction === "next";

  return (
    <button
      data-direction={direction}
      title={`Show ${direction}`}
      className={clsx(
        "absolute top-0 bottom-0 z-[1]",
        "from-inverse to-transparent text-secondary",
        isNext ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r",
      )}
      style={{
        width: `calc(max(8vw, 4rem) * ${scrollDistanceRatio})`,
      }}
      onClick={() => scrollSlider(isNext)}
      disabled={isDisabled}
    >
      <Icon
        size={48}
        className={clsx(
          "transition-[opacity_transform] duration-300",
          "absolute -translate-y-1/2 drop-shadow-icon",
          "transform-gpu hover:scale-110",
          isNext ? "right-1" : "left-1",
          isDisabled && "opacity-0",
        )}
      />
    </button>
  );
}
