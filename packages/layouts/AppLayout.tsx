import { Link } from "@remix-run/react"
import clsx from "clsx"
import { useCallback, type ReactNode } from "react"
import UpIcon from "remixicon-react/ArrowUpLineIcon"

import useOffsetScroll from "@gs/hooks/useOffsetScroll"
import useSetHeaderHeight from "@gs/hooks/useSetHeaderHeight"
import Button from "@gs/components/Button"
import RoundedCorner from "@gs/icons/RoundedCorner"

import Navigation, { type NavigationLinkProps } from "@gs/components/Navigation"

export interface AppLayoutProps {
  children: ReactNode
  logoElement: ReactNode
  navigationLinks?: NavigationLinkProps[]
}

export default function AppLayout({
  children,
  logoElement,
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
        <Link
          to="/"
          data-custom-color
          data-custom-border
          className={
            "select-none text-ellipsis overflow-hidden whitespace-nowrap"
          }
        >
          {logoElement}
        </Link>
        <Navigation links={navigationLinks} />
        <RoundedCorner className="top-full left-4 rotate-0" />
        <RoundedCorner className="top-full right-4 rotate-90" />
      </header>

      <main
        id="main"
        className={clsx(
          "relative mx-4 rounded-xl",
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
