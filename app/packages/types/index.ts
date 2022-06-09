import type { CSSProperties, ReactNode } from "react"

export interface TeaserProps {
  id: string
  title: string
  subtitle?: string
  description?: string
  cover?: string
  icon?: string
  draft?: boolean
  featured?: boolean
  date?: string
  tags?: string[]
}

export interface BaseProps<TRef extends HTMLElement = HTMLElement> {
  id?: string
  className?: string
  style?: CSSProperties
  elementRef?: React.Ref<TRef>
  children?: ReactNode
}

export interface LinkObject<T = LinkType> {
  url: string
  title?: string
  type?: T
}

export type LinkType =
  | "homepage"
  | "other"
  | "github"
  | "linkedin"
  | "twitter"
  | "demo"
  | "blog"
  | "npm"
  | "prototype"
  | "design"

export type Gallery = Array<{ url: string; alt: string }>
