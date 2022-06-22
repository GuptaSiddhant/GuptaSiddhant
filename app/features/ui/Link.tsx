import { type LinkProps, Link } from "@remix-run/react"
import clsx from "clsx"
import type { ReactNode } from "react"
import React, { type ComponentPropsWithoutRef } from "react"

import { isExternalLink } from "~/features/helpers"
import ExternalLinkIcon from "~/features/icons/ExternalLinkIcon"
import type { BaseProps } from "~/features/types"

export { type LinkProps, Link }

export type To = LinkProps["to"]
export interface ExternalLinkProps {
  href?: string
  tooltipLabel?: string
  enableIcon?: boolean
  disableUnderline?: boolean
}

export interface NavigationLinkProps {
  id: string
  children: ReactNode
  to?: To
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
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
        "text-link no-underline hocus:text-link-hover hocus:underline active:text-link",
        className,
      )}
    >
      {children}
    </Link>
  )
}

/** ExternalLink component */
export function ExternalLink({
  children,
  className,
  href,
  tooltipLabel,
  enableIcon,
  disableUnderline,
  ...props
}: BaseProps & ExternalLinkProps): JSX.Element | null {
  if (!href) return <>{children}</>

  return (
    <a
      {...props}
      href={href}
      className={clsx(
        "text-link",
        className,
        !disableUnderline && "hocus:underline",
      )}
      target="_blank"
      rel="noreferrer"
      title={tooltipLabel}
    >
      {children}
      {enableIcon && <ExternalLinkIcon />}
    </a>
  )
}
