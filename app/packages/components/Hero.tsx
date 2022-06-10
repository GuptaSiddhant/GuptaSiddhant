import { Link } from "@remix-run/react"
import clsx from "clsx"
import { type ReactElement } from "react"
import BackIcon from "remixicon-react/ArrowLeftLineIcon"
import ErrorIcon from "remixicon-react/ErrorWarningLineIcon"
import HashIcon from "remixicon-react/HashtagIcon"

import type { BaseProps } from "~/packages/types"

import Section from "./Section"
import { Caption, H1, SubHeading } from "./Text"

export default function Hero({
  className,
  ...props
}: BaseProps): JSX.Element | null {
  return (
    <Section.Prose
      id="hero"
      {...props}
      className={clsx(className, "mt-[10vh]")}
    />
  )
}

Hero.Header = HeroHeader

export interface HeroHeaderProps {
  title: string
  subtitle?: string
  caption?: HeroHeaderCaptionType
}

function HeroHeader({
  caption,
  title,
  subtitle,
}: HeroHeaderProps): JSX.Element | null {
  return (
    <header className="flex flex-col gap-4">
      <HeroHeaderCaption caption={caption} />
      <H1>{title}</H1>
      {subtitle ? <SubHeading>{subtitle}</SubHeading> : null}
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

function HeroHeaderCaption({ caption }: { caption?: HeroHeaderCaptionType }) {
  if (!caption) return null

  if (typeof caption === "string") return <Caption>{caption}</Caption>

  const { icon, className = caption.className } = getHeroHeaderCaptionIcon(
    caption.icon,
  )

  return (
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
      return { icon: <HashIcon />, className: "text-link" }
    case "error":
      return { icon: <ErrorIcon />, className: "text-error" }
    default:
      return { icon }
  }
}
