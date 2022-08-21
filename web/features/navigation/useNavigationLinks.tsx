import GithubIcon from "remixicon-react/GithubFillIcon"
import LinkedinIcon from "remixicon-react/LinkedinBoxFillIcon"
import MailIcon from "remixicon-react/MailLineIcon"

import { useLoaderData } from "@remix-run/react"

import { type AboutInfo } from "@gs/models/about/info"
import type { NavigationLinkProps } from "@gs/navigation/types"
import type { RootLoaderData } from "@gs/root"
import useSearch from "@gs/search"
import SearchButton from "@gs/search/SearchButton"
import type { ThemeName } from "@gs/theme"
import ThemeToggleButton from "@gs/theme/ThemeToggleButton"

import type { NavigationRemoteConfig } from "./service.server"

export interface UseNavigationLinksProps {
  about: AboutInfo
  navigationRemoteConfig: NavigationRemoteConfig
  isAuthenticated: boolean
  themeName: ThemeName
}

export const internalNavigationLinks: NavigationLinkProps[] = [
  { id: "about", to: "/about", children: "About", shortcut: ["Shift", "A"] },
  {
    id: "projects",
    to: "/projects",
    children: "Projects",
    shortcut: ["Shift", "P"],
  },
  { id: "blog", to: "/blog", children: "Blog", shortcut: ["Shift", "B"] },
]

export default function useNavigationLinks(): NavigationLinkProps[] {
  const { toggleSearchOpen } = useSearch()
  const { about, themeName } = useLoaderData<RootLoaderData>()
  const { email, github, linkedin } = about.link || {}

  const links: NavigationLinkProps[] = []

  links.push(...internalNavigationLinks)

  // External

  if (github)
    links.push({
      id: "GitHub",
      to: github,
      children: <GithubIcon />,
      shortcut: ["Shift", "G"],
    })

  if (linkedin)
    links.push({
      id: "LinkedIn",
      to: linkedin,
      children: <LinkedinIcon />,
      shortcut: ["Shift", "L"],
    })

  if (email)
    links.push({
      id: "Contact",
      to: email.includes("mailto") ? email : `mailto:${email}`,
      children: <MailIcon />,
      shortcut: ["Shift", "C"],
    })

  // Buttons

  links.push({
    id: "Search",
    onClick: toggleSearchOpen,
    children: <SearchButton />,
    shortcut: ["Meta", "K"],
  })

  links.push({
    id: "Theme",
    children: <ThemeToggleButton themeName={themeName} />,
  })

  return links
}
