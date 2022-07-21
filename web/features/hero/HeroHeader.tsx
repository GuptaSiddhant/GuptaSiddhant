import clsx from "clsx"
import { type ReactElement, type ReactNode } from "react"
import BackIcon from "remixicon-react/ArrowLeftLineIcon"
import ErrorIcon from "remixicon-react/ErrorWarningLineIcon"
import HashIcon from "remixicon-react/HashtagIcon"

import { Link } from "@remix-run/react"

import { proseWidth } from "@gs/ui/Section"
import { Caption, H1, SubHeading } from "@gs/ui/Text"

export interface HeroHeaderProps {
  title: string
  subtitle?: string
  caption?: HeroHeaderCaptionType
  children?: ReactNode
}

export default function HeroHeader({
  caption,
  title,
  subtitle,
  children,
}: HeroHeaderProps): JSX.Element | null {
  return (
    <header className={clsx("flex flex-col items-start gap-4", proseWidth)}>
      <HeroHeaderCaption caption={caption}>{children}</HeroHeaderCaption>
      <div className="mt-4 flex flex-col gap-4">
        <H1 className="text-primary">{title}</H1>
        {subtitle ? (
          <SubHeading className="text-secondary">{subtitle}</SubHeading>
        ) : null}
      </div>
    </header>
  )
}

export type HeroHeaderCaptionType =
  | string
  | {
      label: string
      to?: string
      className?: string
      icon?: HeroHeaderCaptionIconType
    }

export function HeroHeaderCaption({
  caption,
  children,
}: {
  caption?: HeroHeaderCaptionType
  children?: ReactNode
}) {
  if (!caption) return null

  if (typeof caption === "string")
    return (
      <Caption className="flex w-full items-center justify-between">
        <span className="flex-1">{caption}</span>
        <div className="flex w-max items-center justify-end gap-4">
          {children}
        </div>
      </Caption>
    )

  const { icon, className = caption.className } = getHeroHeaderCaptionIcon(
    caption.icon,
  )

  const captionElement = (
    <Link to={caption.to || "#"} className={clsx("relative", className)}>
      <Caption className="text-current">{caption.label}</Caption>
      {icon ? (
        <div
          className={clsx(
            "hidden md:flex-center",
            "absolute -left-8 top-1",
            "scale-125 fill-current ",
          )}
        >
          {icon}
        </div>
      ) : null}
    </Link>
  )

  if (!children) return captionElement

  return (
    <div className="flex w-full items-center justify-between">
      {captionElement}
      <div className="flex w-max items-center justify-end gap-4">
        {children}
      </div>
    </div>
  )
}

export type HeroHeaderCaptionIconType = ReactElement | "back" | "hash" | "error"

function getHeroHeaderCaptionIcon(icon?: HeroHeaderCaptionIconType): {
  icon?: ReactElement
  className?: string
} {
  switch (icon) {
    case "back":
      return { icon: <BackIcon />, className: "text-link" }
    case "hash":
      return { icon: <HashIcon />, className: "text-tertiary" }
    case "error":
      return { icon: <ErrorIcon />, className: "text-negative" }
    default:
      return { icon }
  }
}
