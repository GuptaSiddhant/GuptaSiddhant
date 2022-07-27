import clsx from "clsx"
import type { ReactNode } from "react"
import PrototypeIcon from "remixicon-react/DeviceLineIcon"
import GithubIcon from "remixicon-react/GithubFillIcon"
import HomepageIcon from "remixicon-react/GlobalLineIcon"
import LinkedinIcon from "remixicon-react/LinkedinBoxFillIcon"
import NpmIcon from "remixicon-react/NpmjsLineIcon"

import { Link } from "@remix-run/react"

import { getStylingByDatabaseModel } from "@gs/models"
import type { Gallery, LinkObject } from "@gs/types"
import { ExternalLink } from "@gs/ui/Link"
import Mdx from "@gs/ui/Mdx"
import { H5, H6, Paragraph } from "@gs/ui/Text"
import { formatDate } from "@gs/utils/format"

import type { SummaryItem } from "../types"

export default function TimelineCard(props: {
  item: SummaryItem
}): JSX.Element | null {
  const {
    id,
    title,
    subtitle,
    model,
    date,
    icon,
    cover,
    links = [],
    duration,
    linkUrl,
  } = props.item
  const modelStyling = getStylingByDatabaseModel(model)

  return (
    <Link
      to={linkUrl || id}
      className={clsx("group scroll-mt-28 no-underline")}
    >
      <article
        id={id}
        className={clsx(
          "relative rounded-lg border-2 border-divider bg-secondary",
          "flex w-full scroll-m-20 flex-col p-8 transition-colors",
          cover ? "pb-0" : "",
          modelStyling.text,
          modelStyling.border,
        )}
      >
        <Sticker {...props.item} />

        <TimelineCardTitle
          icon={modelStyling.icon}
          className={modelStyling.bg}
          id={id}
        >
          {title}
        </TimelineCardTitle>

        <TimelineCardSubtitle>{subtitle}</TimelineCardSubtitle>

        <TimelineCardByline>
          {duration || formatDate(date || new Date())}
          <TimelineCardLinker links={links} />
        </TimelineCardByline>

        <TimelineCardGallery
          gallery={[{ url: cover || "", alt: "" }]}
          iconUrl={icon}
          alt={id}
        />
      </article>
    </Link>
  )
}

function TimelineCardTitle({
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
  )
}

function TimelineCardSubtitle({
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
        "leading-relaxed tracking-wide text-current transition-colors",
      )}
    >
      {children}
    </H6>
  )
}

function TimelineCardByline({
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

function TimelineCardDescription({
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

function TimelineCardGallery({
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
    <figure className={clsx("relative -mx-8 mt-8 h-72 overflow-hidden")}>
      <img
        src={coverUrl}
        alt={alt}
        className="h-full w-full overflow-hidden rounded-b-md object-cover object-center"
      />

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

function TimelineCardLinker({ links = [] }: { links?: LinkObject[] }) {
  if (links.length === 0) return null

  return (
    <>
      <span>|</span>
      {links.map(({ type, url, title }) => {
        const content = (() => {
          switch (type) {
            case "homepage":
              return <HomepageIcon />
            case "linkedin":
              return <LinkedinIcon />
            case "github":
              return <GithubIcon />
            case "npm":
              return <NpmIcon />
            case "prototype":
              return <PrototypeIcon />
            default:
              return title || type
          }
        })()

        return (
          <ExternalLink
            key={type || url}
            href={url}
            disableUnderline
            tooltipLabel={title || type}
          >
            {content}
          </ExternalLink>
        )
      })}
    </>
  )
}

function Sticker({ draft }: SummaryItem): JSX.Element | null {
  if (!draft) return null

  return (
    <div className="absolute top-0 right-0 rounded-bl-md rounded-tr-md bg-black px-2">
      Draft
    </div>
  )
}
