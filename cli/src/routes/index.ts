import { createContext, ReactNode, useContext, useState } from "react";
import About from "./About";
import Education from "./Education";
import Career from "./Career";
import Projects from "./Projects";
import Blog from "./Blog";
import ErrorText from "../components/Error";

const routes: Route[] = [
  { path: "about", title: "About", Component: About },
  { path: "career", title: "Career", Component: Career },
  { path: "education", title: "Education", Component: Education },
  { path: "projects", title: "Projects", Component: Projects },
  { path: "blog", title: "Blog", Component: Blog },
];

export default routes;

export const RouterContext = createContext<RouterState | undefined>(undefined);

export function useRouter(): RouterState {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("Route outside Router provider.");
  return ctx;
}

export function useRouterState(path?: RoutePath) {
  const routerState = useState<RoutePath>(path || routes[0].path);
  const PageComponent =
    routes.find((route) => route.path === routerState[0])?.Component ||
    ErrorText;

  return { routerState, PageComponent };
}

export function useCurrentRoute(): Route {
  const currentRoutePath = useRouter()[0];
  return routes.find((route) => route.path === currentRoutePath) || routes[0];
}

export type RoutePath = "about" | "career" | "education" | "projects" | "blog";
export interface Route {
  path: RoutePath;
  title: string;
  Component: ReactNode;
}
export type RouterState = [RoutePath, (path: RoutePath) => void];
