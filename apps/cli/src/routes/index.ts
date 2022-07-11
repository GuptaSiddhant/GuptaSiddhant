import { createContext, useContext, useState } from "react"

import ErrorText from "../components/Error"
import About from "./About"
import Blog from "./Blog"
import Career from "./Career"
import Education from "./Education"
import Projects from "./Projects"

const routes: Route[] = [
  { path: "about", title: "About", Component: About },
  { path: "career", title: "Career", Component: Career },
  { path: "education", title: "Education", Component: Education },
  { path: "projects", title: "Projects", Component: Projects },
  { path: "blog", title: "Blog", Component: Blog },
]

export default routes

export const RouterContext = createContext<RouterState | undefined>(undefined)

export function useRouter(): RouterState {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error("Route outside Router provider.")
  return ctx
}

export function useRouterState(path?: RoutePath) {
  const routerState = useState<RoutePath>(path || routes[0].path)
  const PageComponent =
    routes.find((route) => route.path === routerState[0])?.Component ||
    ErrorText

  return { routerState, PageComponent }
}

export function useCurrentRoute(): Route {
  const currentRoutePath = useRouter()[0]
  return findMatchingRoute(currentRoutePath)
}

export function findMatchingRoute(path: RoutePath): Route {
  return routes.find((route) => route.path === path) || routes[0]
}

export type RoutePath = "about" | "career" | "education" | "projects" | "blog"
export interface Route {
  path: RoutePath
  title: string
  Component: (props: any) => JSX.Element
}
export type RouterState = [RoutePath, (path: RoutePath) => void]
