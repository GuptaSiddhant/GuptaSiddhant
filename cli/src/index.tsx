#!/usr/bin/env node

import React from "react";
import { render, Box } from "ink";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import { RouterProvider } from "./Router";
import Page from "./pages";
import { Divider } from "./components/misc";
import useBoxWidth from "./helpers/useBoxWidth";

function App(): JSX.Element {
  const { ref, width } = useBoxWidth();

  return (
    <Box
      ref={ref}
      flexDirection="column"
      paddingY={1}
      paddingX={2}
      borderStyle="bold"
    >
      <RouterProvider>
        <Header />
        <Navigation />
        <Divider width={width - 6} />
        <Page />
        <Divider width={width - 6} />
        <Footer />
      </RouterProvider>
    </Box>
  );
}

console.clear();
console.clear();
render(<App />);
