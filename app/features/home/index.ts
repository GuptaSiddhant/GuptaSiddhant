import type { TeaserProps } from "@gs/helpers/teaser"
import { type NavigationRemoteConfig } from "./navigation"

export interface RootLoaderData extends NavigationRemoteConfig {}

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
