import clsx from "clsx"
import useOffsetScroll from "gs-hooks/useOffsetScroll"
import { useCallback } from "react"
import UpIcon from "remixicon-react/ArrowUpLineIcon"

import Button from "../components/Button"
import RoundedCorner from "./RoundedCorner"

export default function Footer(): JSX.Element {
  const { isOffsetScrolled: scrollButtonVisible } = useOffsetScroll()
  const handleScrollToTop = useCallback(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
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
      <RoundedCorner bottom />
      <RoundedCorner bottom right />
    </footer>
  )
}
