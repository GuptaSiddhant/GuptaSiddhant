import { Link } from "@remix-run/react"
import clsx from "clsx"
import type { ReactNode } from "react"

import type { Gallery } from "~/features/types"
import { ExternalLink } from "~/features/ui/Link"
import Mdx from "~/features/ui/Mdx"
import { H5, H6, Paragraph } from "~/features/ui/Text"

import useLifelineContext from "./context"

export default function LifelineCard({
  id,
  className,
  children,
}: {
  id: string
  className?: string
  children: ReactNode
}): JSX.Element | null {
  const { selectedId, changeSelectedId } = useLifelineContext()

  return (
    <article
      id={id}
      className={clsx(
        className,
        "group relative rounded-lg border-4 border-divider bg-secondary",
        "flex w-full scroll-m-20 flex-col p-8 transition-colors",
        selectedId === id && "selected",
      )}
      onClick={() => changeSelectedId(id)}
    >
      {children}
    </article>
  )
}

LifelineCard.Title = LifelineCardTitle
LifelineCard.Subtitle = LifelineCardSubtitle
LifelineCard.Byline = LifelineCardByline
LifelineCard.Description = LifelineCardDescription
LifelineCard.Gallery = LifelineCardGallery

function LifelineCardTitle({
  className,
  children,
  icon,
  id,
}: {
  className?: string
  children: ReactNode
  icon: ReactNode
  id?: string
}) {
  return (
    <Link to={{ hash: id }} className={clsx("group scroll-mt-28 no-underline")}>
      <H5 className="relative text-secondary group-hocus:text-primary">
        <div
          className={clsx(
            className,
            "absolute -left-16 -top-0 aspect-square w-10 rounded-lg flex-center",
            "text-white shadow-md",
          )}
          role="presentation"
          title={id}
        >
          {icon}
        </div>
        {children}
      </H5>
    </Link>
  )
}

function LifelineCardSubtitle({
  children,
  className,
  href,
}: {
  children: ReactNode
  className?: string
  href?: string
}) {
  return (
    <ExternalLink
      href={href}
      tooltipLabel="Visit homepage"
      className="!text-current no-underline underline-offset-4 hocus:underline"
    >
      <H6
        className={clsx(
          className,
          "leading-relaxed tracking-wide text-current transition-colors",
        )}
      >
        {children}
      </H6>
    </ExternalLink>
  )
}

function LifelineCardByline({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Paragraph
      className={clsx(
        className,
        "flex items-center gap-2 text-base text-tertiary",
      )}
    >
      {children}
    </Paragraph>
  )
}

function LifelineCardDescription({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx(
        className,
        "mt-4 overflow-auto text-sm",
        "prose prose-sm prose-li:marker:text-disabled dark:prose-invert",
        "max-h-0 transition-[max-height] duration-300 group-hocus:max-h-screen group-selected:max-h-screen",
      )}
    >
      <Mdx mdx={children?.toString() || ""} />
    </div>
  )
}

function LifelineCardGallery({
  gallery = [],
  iconUrl,
  alt,
}: {
  alt: string
  gallery?: Gallery
  iconUrl?: string
}): JSX.Element | null {
  const coverUrl = gallery?.[0]?.url
  if (!coverUrl) return null

  return (
    <figure
      className={clsx(
        "relative mt-4 overflow-hidden",
        "h-80 max-h-[4.5rem] transition-[max-height] group-hocus:max-h-screen group-selected:max-h-screen",
      )}
    >
      <a href={coverUrl} target="_blank" rel="noreferrer">
        <img
          src={coverUrl}
          alt={alt}
          className="h-full w-full overflow-hidden rounded-md object-cover object-top"
        />
      </a>
      {iconUrl ? (
        <img
          src={iconUrl}
          alt={alt + " icon"}
          className="absolute bottom-4 left-4 aspect-square h-10 rounded object-contain"
        />
      ) : null}
    </figure>
  )
}
