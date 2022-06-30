import { NavLink } from "@remix-run/react"
import { useMemo } from "react"
import NavMenuIcon from "remixicon-react/MenuLineIcon"

import { isExternalLink } from "~/features/helpers"
import type { NavigationLinkProps } from "~/features/ui/Link"
import Menu, { type MenuActionProps } from "~/features/ui/Menu"

export interface NavigationProps {
  links: Array<NavigationLinkProps>
}

export default function Navigation({
  links,
}: NavigationProps): JSX.Element | null {
  if (links.length === 0) return null

  const internalLinks = links.filter(
    (link) => link.to && !isExternalLink(link.to.toString()),
  )
  const externalLinks = links.filter(
    (link) => !link.to || isExternalLink(link.to.toString()),
  )

  return (
    <>
      <DesktopNavigation {...{ internalLinks, externalLinks }} />
      <MobileNavigation {...{ internalLinks, externalLinks }} />
    </>
  )
}

interface NavProps {
  internalLinks: Array<NavigationLinkProps>
  externalLinks: Array<NavigationLinkProps>
}

function MobileNavigation({
  internalLinks,
  externalLinks,
}: NavProps): JSX.Element | null {
  const actions: MenuActionProps[] = useMemo(() => {
    const actionsFromInternalLinks: MenuActionProps[] = internalLinks.map(
      ({ id, to = "#", children }) => ({
        id,
        to,
        children,
      }),
    )

    const actionsFromExternalLinks: MenuActionProps = {
      id: "external",
      onSelect: () => {},
      children: <ExternalLinksList links={externalLinks} />,
    }

    return [...actionsFromInternalLinks, actionsFromExternalLinks]
  }, [internalLinks, externalLinks])

  if (actions.length === 0) return null

  return (
    <Menu actions={actions} className="block md:hidden">
      <NavMenuIcon aria-label="Nav menu" />
    </Menu>
  )
}

function DesktopNavigation({
  internalLinks,
  externalLinks,
}: NavProps): JSX.Element | null {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center justify-between gap-6 md:flex"
    >
      <InternalLinksList links={internalLinks} />
      <ExternalLinksList links={externalLinks} />
    </nav>
  )
}

function InternalLinksList({
  links,
}: {
  links: Array<NavigationLinkProps>
}): JSX.Element | null {
  return (
    <ul className="flex items-center justify-start gap-6 text-lg text-secondary">
      {links.map(({ id, to, children }) => (
        <li key={id} className="flex select-none items-center ">
          <NavLink
            to={to!}
            prefetch="intent"
            className={({ isActive }) =>
              isActive
                ? "font-bold text-primary"
                : "underline-offset-8 hocus:text-primary hocus:underline"
            }
          >
            {children}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

function ExternalLinksList({
  links,
}: {
  links: Array<NavigationLinkProps>
}): JSX.Element | null {
  return (
    <ul className="flex items-center justify-end gap-4 text-lg text-secondary">
      {links.map(({ to, children, ...props }) => (
        <li key={props.id} className="flex select-none items-center ">
          {to ? (
            <a
              {...props}
              href={to?.toString()}
              title={props.id}
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ) : props.onClick ? (
            <button {...props} title={props.id}>
              {children}
            </button>
          ) : (
            children
          )}
        </li>
      ))}
    </ul>
  )
}
