import { Link, type LinkProps } from "@remix-run/react"
import clsx from "clsx"
import { type ComponentPropsWithoutRef } from "react"

import { isExternalLink } from "gs-helpers"
import type { BaseProps } from "gs-types"
import ExternalLinkIcon from "gs-ui/icons/ExternalLink"

export { Link, type LinkProps }

export interface ExternalLinkProps {
  href?: string
  tooltipLabel?: string
  enableIcon?: boolean
}

export function AnchorLink({
  href,
  enableIcon,
  ...props
}: ComponentPropsWithoutRef<"a"> & { enableIcon?: boolean }): JSX.Element {
  if (!href) return <></>

  if (isExternalLink(href)) {
    return <ExternalLink href={href} enableIcon={enableIcon} {...props} />
  }

  return <InternalLink to={href} {...props} />
}

export function InternalLink({
  className,
  children,
  ...props
}: LinkProps): JSX.Element {
  return (
    <Link
      {...props}
      className={clsx(
        "text-link no-underline hover:text-link-hover hover:underline active:text-link",
        className,
      )}
    >
      {children}
    </Link>
  )
}

/** ExternalLink component */
export function ExternalLink({
  children = <ExternalLinkIcon />,
  className,
  href,
  tooltipLabel,
  enableIcon,
  ...props
}: BaseProps & ExternalLinkProps): JSX.Element | null {
  if (!href) return null

  return (
    <a
      {...props}
      href={href}
      className={clsx("text-link hover:underline", className)}
      target="_blank"
      rel="noreferrer"
      title={tooltipLabel}
    >
      {children}
      {enableIcon && <ExternalLinkIcon />}
    </a>
  )
}
