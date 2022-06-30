import clsx from "clsx"
import type { ReactNode } from "react"

import { type TocItem } from "~/features/helpers/table-of-contents"

import Section, { proseReaderClassName } from "./Section"
import TableOfContent from "./TableOfContent"

export interface ReaderProps {
  id?: string
  children?: ReactNode
  className?: string
  toc?: TocItem[]
}

export default function Reader({
  children,
  toc = [],
  id,
  className = proseReaderClassName,
}: ReaderProps): JSX.Element | null {
  if (!children) return null

  return (
    <Section
      id={id}
      className={clsx(
        "relative mx-auto rounded md:w-max",
        "md:!grid lg:grid-cols-[200px_auto] xl:grid-cols-[200px_1fr_200px]",
      )}
    >
      <TableOfContent toc={toc} />

      <main className={clsx(className, "px-4 sm:mx-auto")}>{children}</main>
    </Section>
  )
}
