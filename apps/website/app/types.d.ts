import type { useFetcher } from "@remix-run/react"
import type { Fetcher } from "@remix-run/react/transition"
import type LRUCache from "lru-cache"
import type { CSSProperties } from "react"

declare global {
  var projectListCache: LRUCache<string, Teaser[]>
  var cache: LRUCache<string, any>
}

export interface Teaser {
  id: string
  title: string
  subtitle?: string
  cover?: string
  icon?: string
}

export type FetcherWithComponents<T> = ReturnType<typeof useFetcher> &
  Fetcher<T>

export type PropsWithChildren<PropsType = {}> = React.PropsWithChildren<
  PropsType & CommonProps
>

export type CommonProps<TRef extends HTMLElement = HTMLElement> = {
  id?: string
  className?: string
  style?: CSSProperties
  elementRef?: React.Ref<TRef>
}

export type Gallery = { url: string; alt: string }[]

export interface LinkObject<T = BaseLinkType> {
  url: string
  title?: string
  type?: T
}

export type BaseLinkType =
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
