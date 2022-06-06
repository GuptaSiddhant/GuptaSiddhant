import { useMemo } from "react"
import type { NavigationLinkProps } from "~/packages/components/Navigation"
import type { NavigationRemoteConfig } from "./service.server"
import GithubIcon from "remixicon-react/GithubFillIcon"
import LinkedinIcon from "remixicon-react/LinkedinBoxFillIcon"
import SearchIcon from "remixicon-react/Search2LineIcon"

export default function useNavigationLinks(
  navigationRemoteConfig: NavigationRemoteConfig,
): NavigationLinkProps[] {
  const { enableAbout, enableSearch } = navigationRemoteConfig

  return useMemo(() => {
    const aboutLinks: NavigationLinkProps[] = enableAbout
      ? [{ id: "about", to: "/about", children: "About" }]
      : []

    const projectLinks: NavigationLinkProps[] = [
      { id: "projects", to: "/projects", children: "Projects" },
    ]
    const blogLinks: NavigationLinkProps[] = [
      { id: "blog", to: "/blog", children: "Blog" },
    ]

    const socialLinks: NavigationLinkProps[] = [
      { id: "GitHub", to: "https://", children: <GithubIcon /> },
      { id: "LinkedIn", to: "https://", children: <LinkedinIcon /> },
    ]

    const searchLinks: NavigationLinkProps[] = enableSearch
      ? [{ id: "Search", onClick: () => {}, children: <SearchIcon /> }]
      : []

    return [
      ...aboutLinks,
      ...projectLinks,
      ...blogLinks,
      ...socialLinks,
      ...searchLinks,
    ]
  }, [enableAbout, enableSearch])
}
