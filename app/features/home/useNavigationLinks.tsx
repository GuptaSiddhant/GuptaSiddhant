import { useMemo } from "react"
import GithubIcon from "remixicon-react/GithubFillIcon"
import LinkedinIcon from "remixicon-react/LinkedinBoxFillIcon"
import MailIcon from "remixicon-react/MailLineIcon"
import SearchIcon from "remixicon-react/Search2LineIcon"

import type { NavigationLinkProps } from "~/packages/components/Navigation"

import type { About } from "."
import type { NavigationRemoteConfig } from "./service.server"

export default function useNavigationLinks(
  about: About,
  navigationRemoteConfig: NavigationRemoteConfig,
): NavigationLinkProps[] {
  const { enableAbout, enableSearch } = navigationRemoteConfig
  const { link } = about

  const aboutLinks: NavigationLinkProps[] = useMemo(
    () =>
      enableAbout ? [{ id: "about", to: "/about", children: "About" }] : [],
    [enableAbout],
  )

  const projectLinks: NavigationLinkProps[] = useMemo(
    () => [{ id: "projects", to: "/projects", children: "Projects" }],
    [],
  )
  const blogLinks: NavigationLinkProps[] = useMemo(
    () => [{ id: "blog", to: "/blog", children: "Blog" }],
    [],
  )

  const searchLinks: NavigationLinkProps[] = useMemo(
    () =>
      enableSearch
        ? [{ id: "Search", onClick: () => {}, children: <SearchIcon /> }]
        : [],
    [enableSearch],
  )

  const socialLinks: NavigationLinkProps[] = useMemo(() => {
    const links = []
    if (link?.github) {
      links.push({ id: "github", to: link.github, children: <GithubIcon /> })
    }
    if (link?.linkedin) {
      links.push({
        id: "LinkedIn",
        to: link.linkedin,
        children: <LinkedinIcon />,
      })
    }
    if (link?.email) {
      links.push({
        id: "Contact",
        to: link.email,
        children: <MailIcon />,
      })
    }
    return links
  }, [link])

  return [
    ...aboutLinks,
    ...projectLinks,
    ...blogLinks,
    ...socialLinks,
    ...searchLinks,
  ]
}
