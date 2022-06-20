import clsx from "clsx"
import type { ReactNode } from "react"
import { Link } from "react-router-dom"

import MdxContent from "../mdx/MdxContent"
import { H5, H6, Paragraph } from "../ui/Text"

export default function LifelineCard({
  id,
  className,
  children,
  coverUrl,
  iconUrl,
}: {
  id: string
  className?: string
  children: ReactNode
  coverUrl?: string
  iconUrl?: string
}): JSX.Element | null {
  return (
    <Link id={id} to={"#" + id} className="group scroll-mt-16">
      <article
        className={clsx(
          className,
          "relative bg-secondary rounded-lg border-4 border-gray-700",
          "transition-colors",
        )}
      >
        <div className={clsx("flex flex-col p-8", coverUrl && "pb-4")}>
          {children}
        </div>
        {coverUrl ? (
          <figure className="p-4 w-full relative">
            <img
              src={coverUrl}
              alt={id}
              className="overflow-hidden h-60 w-full object-cover object-top rounded-md"
            />
            {iconUrl ? (
              <img
                src={iconUrl}
                alt={id + " icon"}
                className="h-10 aspect-square object-contain rounded absolute bottom-8 left-8"
              />
            ) : null}
          </figure>
        ) : null}
      </article>
    </Link>
  )
}

LifelineCard.Title = LifelineCardTitle
LifelineCard.Subtitle = LifelineCardSubtitle
LifelineCard.Byline = LifelineCardByline
LifelineCard.Description = LifelineCardDescription

function LifelineCardTitle({
  className,
  children,
  icon,
  alt,
}: {
  className?: string
  children: ReactNode
  icon: ReactNode
  alt?: string
}) {
  return (
    <H5 className="text-secondary group-hocus:text-primary relative">
      <div
        className={clsx(
          className,
          "w-10 aspect-square rounded-lg absolute -left-16 -top-0 flex-center",
          "transition-colors shadow-md",
        )}
        role="presentation"
        title={alt}
      >
        {icon}
      </div>
      {children}
    </H5>
  )
}

function LifelineCardSubtitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <H6
      className={clsx(
        className,
        "tracking-wide group-hocus:text-secondary",
        "transition-colors",
      )}
    >
      {children}
    </H6>
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
    <Paragraph className={clsx(className, "text-base text-tertiary")}>
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
        "overflow-hidden mt-4 text-sm",
        "prose prose-invert prose-sm prose-li:marker:text-disabled",
        "max-h-20 group-hocus:max-h-screen-main transition-[max-height]",
      )}
    >
      <MdxContent mdx={children?.toString() || ""} />
    </div>
  )
}
