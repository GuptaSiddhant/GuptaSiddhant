import { type LinkProps, Link } from "@remix-run/react"
import clsx from "clsx"
import type { ReactNode } from "react"
import React, { type ComponentPropsWithoutRef } from "react"

import { isExternalLink } from "~/packages/helpers"
import ExternalLinkIcon from "~/packages/icons/ExternalLinkIcon"
import type { BaseProps } from "~/packages/types"

export { type LinkProps, Link }

export type To = LinkProps["to"]
export interface ExternalLinkProps {
  href?: string
  tooltipLabel?: string
  enableIcon?: boolean
}

export interface NavigationLinkProps {
  id: string
  children: ReactNode
  to?: To
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
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
  ...props
}: BaseProps & ExternalLinkProps): JSX.Element | null {
  if (!href) return <>{children}</>

  return (
    <a
      {...props}
      href={href}
      className={clsx("text-link hocus:underline", className)}
      target="_blank"
      rel="noreferrer"
      title={tooltipLabel}
    >
      {children}
      {enableIcon && <ExternalLinkIcon />}
    </a>
  )
}
