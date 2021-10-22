import React, { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";

const Routes = [
  "About",
  "Career",
  "Education",
  "Projects",
  // "Blog"
] as const;

export type Route = typeof Routes[number];

export default Routes;

export type RouterState = [Route, Dispatch<SetStateAction<Route>>];

const initialRoute = Routes[0];

const RouterContext = createContext<RouterState>([initialRoute, () => {}]);

export function useRouter() {
  return useContext(RouterContext);
}

export function RouterProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const routerState = React.useState<Route>(initialRoute);

  return (
    <RouterContext.Provider value={routerState}>
      {children}
    </RouterContext.Provider>
  );
}
