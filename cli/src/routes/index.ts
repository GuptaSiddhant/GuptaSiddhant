import { createContext, useContext, useState } from "react";
import About from "./About";
import Education from "./Education";
import Career from "./Career";
import Projects from "./Projects";
import ErrorText from "../components/Error";

const routes = [
  { path: "about", title: "About", Component: About },
  { path: "career", title: "Career", Component: Career },
  { path: "education", title: "Education", Component: Education },
  { path: "projects", title: "Projects", Component: Projects },
  // "Blog"
] as const;

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

export type RoutePath = typeof routes[number]["path"];
export type RouterState = [RoutePath, (path: RoutePath) => void];
