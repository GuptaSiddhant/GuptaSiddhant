import React from "react";
import { Box, render } from "ink";

import { RouterContext, useRouterState } from "./Router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Divider from "./components/Divider";
import useBoxWidth from "./helpers/useBoxWidth";
import { useShortcuts } from "./helpers/shortcuts";
import { appBoxStyle } from "./helpers/styles";

function App(): JSX.Element {
  const { ref, width } = useBoxWidth();
  const { routerState, PageComponent } = useRouterState();
  useShortcuts();

  return (
    <Box ref={ref} {...appBoxStyle}>
      <RouterContext.Provider value={routerState}>
        <Header />
        <Navigation />
        <Divider width={width - 6} />
        <Box marginTop={1}>
          <PageComponent />
        </Box>
        <Divider width={width - 6} />
        <Footer />
      </RouterContext.Provider>
    </Box>
  );
}

render(<App />);
