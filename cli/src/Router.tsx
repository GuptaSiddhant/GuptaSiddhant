import { createContext, useContext, useState } from "react";

import About from "./pages/About";
import Education from "./pages/Education";
import Career from "./pages/Career";
import Projects from "./pages/Projects";
import ErrorText from "./components/Error";

const routes = [
  { path: "about", title: "About", Component: About },
  { path: "career", title: "Career", Component: Career },
  { path: "education", title: "Education", Component: Education },
  { path: "projects", title: "Projects", Component: Projects },
  // "Blog"
] as const;

export const initialRoute = routes[0].path;
export default routes;

export const RouterContext = createContext<RouterState>([
  routes[0].path,
  () => {},
]);

export function useRouter() {
  return useContext(RouterContext);
}

export function useRouterState() {
  const routerState = useState<RoutePath>(initialRoute);
  const PageComponent =
    routes.find((route) => route.path === routerState[0])?.Component ||
    ErrorText;

  return { routerState, PageComponent };
}

export type RoutePath = typeof routes[number]["path"];
export type RouterState = [RoutePath, (path: RoutePath) => void];
