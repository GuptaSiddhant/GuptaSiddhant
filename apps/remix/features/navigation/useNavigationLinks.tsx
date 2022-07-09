import { useNavigate } from "@remix-run/react"
import GithubIcon from "remixicon-react/GithubFillIcon"
import LinkedinIcon from "remixicon-react/LinkedinBoxFillIcon"
import MailIcon from "remixicon-react/MailLineIcon"
import SearchIcon from "remixicon-react/Search2LineIcon"

import { type AboutInfo } from "~/features/about"
import { AdminIcon } from "~/features/admin"
import type { NavigationLinkProps } from "~/features/navigation/types"
import type { ThemeName } from "~/features/theme"
import ThemeToggleButton from "~/features/theme/ThemeToggleButton"

import type { NavigationRemoteConfig } from "./service.server"

export interface UseNavigationLinksProps {
  about: AboutInfo
  navigationRemoteConfig: NavigationRemoteConfig
  isAuthenticated: boolean
  themeName: ThemeName
}

export const internalNavigationLinks: NavigationLinkProps[] = [
  { id: "about", to: "/about", children: "About" },
  { id: "projects", to: "/projects", children: "Projects" },
  { id: "blog", to: "/blog", children: "Blog" },
]

export default function useNavigationLinks({
  about,
  navigationRemoteConfig,
  themeName,
}: UseNavigationLinksProps): NavigationLinkProps[] {
  const navigate = useNavigate()
  const { enableSearch } = navigationRemoteConfig
  const { email, github, linkedin } = about.link || {}

  const links: NavigationLinkProps[] = []

  links.push(...internalNavigationLinks)

  // External

  if (github) links.push({ id: "GitHub", to: github, children: <GithubIcon /> })

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

  // Buttons

  if (enableSearch) links.push({ id: "Search", children: <SearchIcon /> })

  links.push({
    id: "Admin",
    onClick: () => navigate("/admin"),
    children: <AdminIcon />,
  })

  links.push({
    id: "Theme",
    children: <ThemeToggleButton themeName={themeName} />,
  })

  return links
}
