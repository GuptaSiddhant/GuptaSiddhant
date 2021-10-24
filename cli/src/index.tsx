#!/usr/bin/env node

import { Box, render } from "ink";
import { RouterContext, useRouterState, RoutePath } from "./routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import { useShortcuts } from "./helpers/shortcuts";
import { useEffect } from "react";

function App({ path }: { path?: RoutePath }): JSX.Element {
  const { routerState, PageComponent } = useRouterState(path);
  useShortcuts();

  useEffect(console.clear);

  return (
    <Box flexDirection={"column"} paddingY={1} paddingX={2}>
      <RouterContext.Provider value={routerState}>
        <Header />
        <Navigation />
        <Box marginTop={1}>
          <PageComponent />
        </Box>
        <Footer />
      </RouterContext.Provider>
    </Box>
  );
}

const path = process.argv[2] as RoutePath | undefined;
render(<App path={path} />);
