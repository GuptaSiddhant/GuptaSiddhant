import { type LinkProps } from "@remix-run/react"
import type { CSSProperties, ReactNode } from "react"

export type To = LinkProps["to"]

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

export type RemixSubmitFunctionTarget =
  | HTMLFormElement
  | HTMLButtonElement
  | HTMLInputElement
  | FormData
  | URLSearchParams
  | {
      [name: string]: string
    }
  | null
