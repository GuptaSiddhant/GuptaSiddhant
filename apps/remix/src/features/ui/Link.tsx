import clsx from "clsx";
import { type ComponentPropsWithoutRef } from "react";

import { Link, type LinkProps } from "@remix-run/react";

import { ExternalLinkIcon } from "@gs/icons";
import type { BaseProps } from "@gs/types";
import { isExternalLink } from "@gs/utils/navigation";

export { type LinkProps, Link };

export interface ExternalLinkProps {
  href?: string;
  tooltipLabel?: string;
  enableIcon?: boolean;
  disableUnderline?: boolean;
}

export function AnchorLink({
  href,
  enableIcon,
  ...props
}: ComponentPropsWithoutRef<"a"> & { enableIcon?: boolean }): JSX.Element {
  if (!href) {
    return <></>;
  }

  if (isExternalLink(href)) {
    return <ExternalLink href={href} enableIcon={enableIcon} {...props} />;
  }

  return <InternalLink to={href} {...props} />;
}

export default AnchorLink;

export function InternalLink({
  className,
  children,
  ...props
}: LinkProps): JSX.Element {
  return (
    <Link
      {...props}
      className={clsx(
        "text-link underline active:text-link hocus:text-link-hover",
        className,
      )}
    >
      {children}
    </Link>
  );
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
  if (!href) {
    return <>{children}</>;
  }

  return (
    // rome-ignore lint/a11y/useValidAnchor: Need to stop click propagation
    <a
      {...props}
      href={href}
      className={clsx(
        "text-link underline hocus:text-link-hover",
        className,
        !disableUnderline && "hocus:underline",
      )}
      target="_blank"
      rel="noreferrer"
      title={tooltipLabel}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
      {enableIcon && <ExternalLinkIcon />}
    </a>
  );
}
