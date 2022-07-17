import useOffsetScroll from "@gs/hooks/useOffsetScroll"
import useSetHeaderHeight from "@gs/hooks/useSetHeaderHeight"
import { RoundedCorner } from "@gs/icons"
import Navigation from "@gs/navigation/Navigation"
import type { NavigationLinkProps } from "@gs/navigation/types"
import { Toaster } from "@gs/toaster"
import { FAB } from "@gs/ui/Button"
import clsx from "clsx"
import { type ReactNode, useCallback } from "react"
import UpIcon from "remixicon-react/ArrowUpLineIcon"

import { Search } from "../search"
import { SearchDialog } from "../search/SearchDialog"
import Logo from "./Logo"
import ProgressBar from "./ProgressBar"

export interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps): JSX.Element {
  const headerRef = useSetHeaderHeight()
  const { isOffsetScrolled: scrollButtonVisible } = useOffsetScroll()

  const handleScrollToTop = useCallback(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <Toaster>
      <Search>
        <header
          data-header
          ref={headerRef}
          className={clsx(
            "fixed top-0 left-0 right-0 z-layout bg-default",
            "flex items-center justify-between",
            "py-2 px-8",
          )}
        >
          <Logo />

          <Navigation />
          <RoundedCorner className="top-full left-4 rotate-0" />
          <RoundedCorner className="top-full right-4 rotate-90" />
        </header>

        <main
          id="main"
          className={clsx(
            "relative mx-4 rounded-xl ",
            "bg-primary text-lg",
            "flex flex-col",
            "py-8",
          )}
          style={{
            paddingLeft: `env(safe-area-inset-left)`,
          }}
        >
          {children}
        </main>

        <footer
          data-footer
          className={clsx(
            "fixed bottom-0 right-0 left-0",
            "z-layout h-4 bg-default px-4",
          )}
        >
          {scrollButtonVisible ? (
            <FAB
              className={"absolute right-4 bottom-full m-1 rounded-br-xl"}
              onClick={handleScrollToTop}
              title="Scroll to top"
            >
              <UpIcon aria-label="Scroll to top" />
            </FAB>
          ) : null}
          <RoundedCorner className="bottom-full left-4 -rotate-90" />
          <RoundedCorner className="bottom-full right-4 rotate-180" />
        </footer>

        <ProgressBar />
      </Search>
    </Toaster>
  )
}
