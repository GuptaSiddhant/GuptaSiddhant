import { useLoaderData } from "@remix-run/react"
import { useMemo } from "react"
import GithubIcon from "remixicon-react/GithubFillIcon"
import LinkedinIcon from "remixicon-react/LinkedinBoxFillIcon"
import SearchIcon from "remixicon-react/Search2LineIcon"
import { type NavigationLinkProps } from "@gs/components/Navigation"
import { type RootLoaderData } from "."
import {
  getAreFeaturesEnabled,
  RemoteConfigKey,
} from "~/packages/service/remote-config.server"

const navigationRemoteConfigKeys = [
  RemoteConfigKey.About,
  RemoteConfigKey.Search,
] as const

export function useNavigationLinks(): NavigationLinkProps[] {
  const { enableAbout, enableSearch } = useLoaderData<RootLoaderData>()

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

export function Logo(): JSX.Element | null {
  return (
    <span
      role="presentation"
      className={
        "text-xl font-black uppercase leading-normal tracking-widest text-primary"
      }
    >
      Siddhant Gupta
    </span>
  )
}

// Helpers

export interface NavigationRemoteConfig
  extends Record<typeof navigationRemoteConfigKeys[number], boolean> {}

export async function getNavigationRemoteConfig() {
  return getAreFeaturesEnabled(...navigationRemoteConfigKeys)
}
