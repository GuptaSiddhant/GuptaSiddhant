import clsx from "clsx"
import { ReactNode, useRef } from "react"

import useEventListener from "gs-hooks/useEventListener"

import RoundedCorner from "./RoundedCorner"
import Footer from "./Footer"

export default function Layout({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <>
      <Header />
      <main
        id="main"
        className={clsx(
          "relative mx-4 rounded-xl",
          "bg-primary text-lg",
          "flex flex-col gap-10",
          "min-h-[100vh]",
        )}
      >
        {children}
      </main>
      <Footer />
    </>
  )
}

function Header(): JSX.Element {
  const headerRef = useRef<HTMLElement>(null)

  useEventListener(
    "resize",
    () => {
      const headerHeight =
        headerRef.current?.getBoundingClientRect().height || 0
      document.documentElement.style.setProperty(
        "--header-height",
        `${headerHeight}px`,
      )
    },
    { immediate: true },
  )

  return (
    <header
      data-header
      ref={headerRef}
      className={clsx(
        "fixed top-0 left-0 right-0 z-40 bg-default",
        "grid grid-rows-2 sm:grid-rows-none sm:grid-cols-[1fr_max-content] items-baseline",
        "py-2 px-8",
      )}
    >
      <RoundedCorner />
      <RoundedCorner right />
    </header>
  )
}
