import { Box, Text } from "ink";
import { RouterContext, useRouterState, RoutePath } from "./routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Fullscreen from "./components/Fullscreen";
import { useShortcuts } from "./helpers/shortcuts";
import Divider from "./components/Divider";
import { PADDING_X } from "./helpers/constants";

export default function App({ path }: { path?: RoutePath }): JSX.Element {
  const { routerState, PageComponent } = useRouterState(path);

  useShortcuts();

  return (
    <RouterContext.Provider value={routerState}>
      <Fullscreen flexDirection={"column"} paddingX={0} borderStyle={"round"}>
        <Header />
        <Navigation />
        <Divider />
        <Box
          paddingX={PADDING_X}
          paddingY={1}
          flexGrow={1}
          justifyContent="space-between"
          flexDirection="column"
          height={"100%"}
        >
          <PageComponent />
        </Box>
        <Divider />
        <Footer />
      </Fullscreen>
    </RouterContext.Provider>
  );
}
