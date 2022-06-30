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
        "group relative bg-secondary rounded-lg border-4 border-divider",
        "transition-colors flex flex-col p-8 scroll-m-20 w-full",
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
      <H5 className="text-secondary group-hocus:text-primary relative">
        <div
          className={clsx(
            className,
            "w-10 aspect-square rounded-lg absolute -left-16 -top-0 flex-center",
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
      className="!text-current no-underline hocus:underline underline-offset-4"
    >
      <H6
        className={clsx(
          className,
          "tracking-wide transition-colors text-current leading-relaxed",
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
        "text-base text-tertiary items-center flex gap-2",
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
        "overflow-auto mt-4 text-sm",
        "prose dark:prose-invert prose-sm prose-li:marker:text-disabled",
        "max-h-0 group-hocus:max-h-screen group-selected:max-h-screen transition-[max-height] duration-300",
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
        "mt-4 relative overflow-hidden",
        "h-80 max-h-[4.5rem] group-hocus:max-h-screen group-selected:max-h-screen transition-[max-height]",
      )}
    >
      <a href={coverUrl} target="_blank" rel="noreferrer">
        <img
          src={coverUrl}
          alt={alt}
          className="overflow-hidden h-full w-full object-cover object-top rounded-md"
        />
      </a>
      {iconUrl ? (
        <img
          src={iconUrl}
          alt={alt + " icon"}
          className="h-10 aspect-square object-contain rounded absolute bottom-4 left-4"
        />
      ) : null}
    </figure>
  )
}
