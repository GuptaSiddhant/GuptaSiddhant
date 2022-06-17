import { useMemo } from "react"
import GithubIcon from "remixicon-react/GithubFillIcon"
import LinkedinIcon from "remixicon-react/LinkedinBoxFillIcon"
import MailIcon from "remixicon-react/MailLineIcon"
import SearchIcon from "remixicon-react/Search2LineIcon"

import { type AboutInfo } from "~/packages/about"
import type { NavigationLinkProps } from "~/packages/ui/Link"

import type { NavigationRemoteConfig } from "./service.server"

export interface UseNavigationLinksProps {
  about: AboutInfo
  navigationRemoteConfig: NavigationRemoteConfig
  isAuthenticated: boolean
}

export default function useNavigationLinks({
  about,
  navigationRemoteConfig,
  isAuthenticated,
}: UseNavigationLinksProps): NavigationLinkProps[] {
  const { enableAbout, enableSearch } = navigationRemoteConfig
  const { email, github, linkedin } = about.link || {}

  return useMemo(() => {
    const links: NavigationLinkProps[] = []

    if (enableAbout)
      links.push({ id: "about", to: "/about", children: "About" })

    links.push(
      { id: "projects", to: "/projects", children: "Projects" },
      { id: "blog", to: "/blog", children: "Blog" },
    )

    if (isAuthenticated) {
      links.push({ id: "admin", to: "/admin", children: "Admin" })
    }

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
  }, [enableAbout, enableSearch, email, github, linkedin, isAuthenticated])
}
