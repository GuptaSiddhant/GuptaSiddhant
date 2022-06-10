import { useMemo } from "react"
import GithubIcon from "remixicon-react/GithubFillIcon"
import LinkedinIcon from "remixicon-react/LinkedinBoxFillIcon"
import MailIcon from "remixicon-react/MailLineIcon"
import SearchIcon from "remixicon-react/Search2LineIcon"

import type { NavigationLinkProps } from "~/packages/components/Navigation"

import type { About } from "."
import type { NavigationRemoteConfig } from "./service.server"

export default function useNavigationLinks(
  { link }: About,
  navigationRemoteConfig: NavigationRemoteConfig,
): NavigationLinkProps[] {
  const { enableAbout, enableSearch } = navigationRemoteConfig
  const { email, github, linkedin } = link || {}

  return useMemo(() => {
    const links: NavigationLinkProps[] = []

    if (enableAbout)
      links.push({ id: "about", to: "/about", children: "About" })

    links.push(
      { id: "projects", to: "/projects", children: "Projects" },
      { id: "blog", to: "/blog", children: "Blog" },
    )

    // External

    if (github)
      links.push({ id: "GitHub", to: github, children: <GithubIcon /> })

    if (linkedin)
      links.push({
        id: "LinkedIn",
        to: linkedin,
        children: <LinkedinIcon />,
      })

    if (email)
      links.push({
        id: "Contact",
        to: email,
        children: <MailIcon />,
      })

    if (enableSearch)
      links.push({ id: "Search", onClick: () => {}, children: <SearchIcon /> })

    return links
  }, [enableAbout, enableSearch, email, github, linkedin])
}
