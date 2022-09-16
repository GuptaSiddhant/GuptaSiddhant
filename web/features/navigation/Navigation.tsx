import { Fragment, useId, useMemo } from "react"
import NavMenuIcon from "remixicon-react/Menu3LineIcon"

import { NavLink } from "@remix-run/react"

import { isExternalLink } from "@gs/helpers"
import Menu, { type MenuActionProps } from "@gs/ui/Menu"

import type { NavigationLinkProps } from "./types"
import useNavigationLinks from "./useNavigationLinks"

export default function Navigation(): JSX.Element | null {
  const links = useNavigationLinks()

  if (links.length === 0) return null

  const internalLinks = links.filter(
    (link) => link.to && !isExternalLink(link.to.toString()) && !link.external,
  )
  const externalLinks = links.filter(
    (link) => (link.to && isExternalLink(link.to.toString())) || link.external,
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
  const uid = useId()

  const actions: MenuActionProps[] = useMemo(() => {
    const actionsFromInternalLinks: MenuActionProps[] = internalLinks.map(
      ({ id, to = "#", children }) => ({
        id: uid + id,
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
  const uid = useId()

  return (
    <div className="flex items-center justify-start gap-4 text-lg text-secondary">
      {buttons.map(({ id, onClick, children }) => {
        if (!onClick) return <Fragment key={id}>{children}</Fragment>

        return (
          <button
            key={uid + "-" + id}
            onClick={onClick}
            type="button"
            title={id}
          >
            {children}
          </button>
        )
      })}
    </div>
  )
}

function InternalLinksList({
  links,
}: {
  links: Array<NavigationLinkProps>
}): JSX.Element | null {
  const uid = useId()

  return (
    <ul className="flex items-center justify-start gap-6 text-lg text-secondary">
      {links.map(({ id, to, children }) => (
        <li key={uid + id} className="flex select-none items-center ">
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
  const uid = useId()
  return (
    <ul className="flex items-center justify-end gap-4 text-lg text-secondary">
      {links.map(({ to, children, ...props }) => (
        <li key={uid + props.id} className="flex select-none items-center ">
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
            <button type="button" {...props} title={props.id}>
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
