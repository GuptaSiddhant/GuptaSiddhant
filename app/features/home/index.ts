import type { TeaserProps } from "~/packages/helpers/teaser"
import type { NavigationRemoteConfig } from "../navigation/index.server"

export interface RootLoaderData {
  about: About
  navigationRemoteConfig: NavigationRemoteConfig
}

export interface HomeLoaderData {
  about: About
  projects: TeaserProps[]
  blogPosts: TeaserProps[]
}

export interface About {
  name: string
  shortName: string
  title: string
  terminalResume: {
    code: string
    copyText?: string
  }
  currentCompany: { name: string; hiringLink?: string; link?: string }
  techStack?: string[]
  heroAdjectives?: string[]
}
