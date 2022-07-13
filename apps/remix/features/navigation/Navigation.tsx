import { NavLink } from "@remix-run/react"
import { Fragment, useMemo } from "react"
import NavMenuIcon from "remixicon-react/Menu3LineIcon"

import { isExternalLink } from "@features/helpers"
import Menu, { type MenuActionProps } from "@features/ui/Menu"

import type { NavigationLinkProps } from "./types"

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
    (link) => link.to && isExternalLink(link.to.toString()),
  )
  const buttons = links.filter((link) => !link.to)

  return (
    <>
      <DesktopNavigation {...{ internalLinks, externalLinks, buttons }} />
      <MobileNavigation {...{ internalLinks, externalLinks, buttons }} />
    </>
  )
}

interface NavProps {
  internalLinks: Array<NavigationLinkProps>
  externalLinks: Array<NavigationLinkProps>
  buttons: Array<NavigationLinkProps>
}

function MobileNavigation({
  internalLinks,
  externalLinks,
  buttons,
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
    <nav className="flex gap-4 md:hidden">
      <ButtonsList buttons={buttons} />
      <Menu actions={actions}>
        <NavMenuIcon aria-label="Nav menu" />
      </Menu>
    </nav>
  )
}

function DesktopNavigation({
  internalLinks,
  externalLinks,
  buttons,
}: NavProps): JSX.Element | null {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center justify-between gap-6 md:flex"
    >
      <InternalLinksList links={internalLinks} />
      <ExternalLinksList links={externalLinks} />
      <ButtonsList buttons={buttons} />
    </nav>
  )
}

function ButtonsList({
  buttons,
}: {
  buttons: NavigationLinkProps[]
}): JSX.Element | null {
  return (
    <ul className="flex items-center justify-start gap-4 text-lg text-secondary">
      {buttons.map(({ id, onClick, children }) => {
        if (!onClick) return <Fragment key={id}>{children}</Fragment>

        return (
          <button key={id} onClick={onClick}>
            {children}
          </button>
        )
      })}
    </ul>
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
