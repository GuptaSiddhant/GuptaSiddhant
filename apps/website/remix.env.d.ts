/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

import type LRUCache from "lru-cache"

declare module "react-overdrive" {
  export interface OverdriveProps {
    id: string
    children: React.ReactElement
    duration?: number
    easing?: string
    element?: keyof JSX.IntrinsicElements
    animationDelay?: number
    onAnimationEnd?: () => void
    style?: React.CSSProperties
    // rest
    className?: string
    ref?: React.Ref<any>
    onClick?: () => void
  }

  export default function Overdrive(props: OverdriveProps): JSX.Element
}

declare namespace NodeJS {
  interface ProcessEnv {
    CACHE_TTL: string
  }
}

declare global {
  var cache: LRUCache<string, any>
}
