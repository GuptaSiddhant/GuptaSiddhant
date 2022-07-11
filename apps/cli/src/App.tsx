import { type BoxProps, Box } from "ink"

import Divider from "./components/Divider"
import Fullscreen from "./components/Fullscreen"
import Title from "./components/Title"
import { PADDING_X } from "./helpers/constants"
import { useShortcuts } from "./helpers/shortcuts"
import { type RoutePath, RouterContext, useRouterState } from "./routes"
import Footer from "./ui/Footer"
import Header from "./ui/Header"
import Navigation from "./ui/Navigation"

const boxProps: BoxProps = {
  paddingX: PADDING_X,
  flexGrow: 1,
  justifyContent: "space-between",
  flexDirection: "column",
}

export default function App({ path }: { path?: RoutePath }): JSX.Element {
  const { routerState, PageComponent } = useRouterState(path)
  useShortcuts()

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
  )
}
