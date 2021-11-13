import { Box } from "ink";
import { RouterContext, useRouterState } from "./routes";

import Header from "./ui/Header";
import Navigation from "./ui/Navigation";
import Footer from "./ui/Footer";

import Title from "./components/Title";
import Fullscreen from "./components/Fullscreen";
import Divider from "./components/Divider";

import { PADDING_X } from "./helpers/constants";
import { useShortcuts } from "./helpers/shortcuts";

import type { BoxProps } from "ink";
import type { RoutePath } from "./routes";

const boxProps: BoxProps = {
  paddingX: PADDING_X,
  flexGrow: 1,
  justifyContent: "space-between",
  flexDirection: "column",
};

export default function App({ path }: { path?: RoutePath }): JSX.Element {
  const { routerState, PageComponent } = useRouterState(path);
  useShortcuts();

  return (
    <RouterContext.Provider value={routerState}>
      <Fullscreen flexDirection={"column"} paddingX={0} borderStyle={"round"}>
        <Header />
        <Navigation />
        <Divider />
        <Title />
        <Box {...boxProps}>
          <PageComponent />
        </Box>
        <Divider />
        <Footer />
      </Fullscreen>
    </RouterContext.Provider>
  );
}
