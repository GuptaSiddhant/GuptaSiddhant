import clsx from "clsx"
import { type ReactNode,useCallback } from "react"
import UpIcon from "remixicon-react/ArrowUpLineIcon"

import Button from "~/packages/components/Button"
import Navigation, {
  type NavigationLinkProps,
} from "~/packages/components/Navigation"
import useOffsetScroll from "~/packages/hooks/useOffsetScroll"
import useSetHeaderHeight from "~/packages/hooks/useSetHeaderHeight"
import RoundedCorner from "~/packages/icons/RoundedCorner"

import Logo from "../components/Logo"

export interface AppLayoutProps {
  children: ReactNode
  navigationLinks?: NavigationLinkProps[]
}

export default function AppLayout({
  children,
  navigationLinks = [],
}: AppLayoutProps): JSX.Element {
  const headerRef = useSetHeaderHeight()
  const { isOffsetScrolled: scrollButtonVisible } = useOffsetScroll()

  const handleScrollToTop = useCallback(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <>
      <header
        data-header
        ref={headerRef}
        className={clsx(
          "fixed top-0 left-0 right-0 z-40 bg-default",
          "grid grid-rows-2 sm:grid-rows-none sm:grid-cols-[1fr_max-content] items-baseline",
          "py-2 px-4 sm:px-8",
        )}
      >
        <Logo />

        <Navigation links={navigationLinks} />
        <RoundedCorner className="top-full left-4 rotate-0" />
        <RoundedCorner className="top-full right-4 rotate-90" />
      </header>

      <main
        id="main"
        className={clsx(
          "relative mx-4 rounded-xl ",
          "bg-primary text-lg",
          "flex flex-col gap-10",
          "min-h-[100vh] py-16",
        )}
      >
        {children}
      </main>

      <footer
        data-footer
        className={clsx(
          "fixed bottom-0 right-0 left-0",
          "h-4 z-40 bg-default px-4",
        )}
      >
        {scrollButtonVisible ? (
          <Button
            className={clsx(
              "absolute right-4 bottom-full m-0.5",
              "rounded-br-xl",
            )}
            onClick={handleScrollToTop}
            title="Scroll to top"
          >
            <UpIcon aria-label="Scroll to top" />
          </Button>
        ) : null}
        <RoundedCorner className="bottom-full left-4 -rotate-90" />
        <RoundedCorner className="bottom-full right-4 rotate-180" />
      </footer>
    </>
  )
}
