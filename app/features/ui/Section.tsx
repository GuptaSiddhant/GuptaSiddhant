import clsx from "clsx"
import type { ReactNode } from "react"

import {
  type TocItem,
  arrangeTocByLevels,
} from "~/features/helpers/table-of-contents"
import type { BaseProps } from "~/features/types"

import TocFloating from "./TocFloating"
import TocInline from "./TocInline"
export default function Section({
  children,
  className,
  elementRef,
  ...props
}: BaseProps): JSX.Element {
  return (
    <section
      {...props}
      className={clsx(
        "relative",
        "w-full py-[10vh] scroll-mt-header-height",
        "flex flex-col gap-12",
        className,
      )}
      ref={elementRef}
    >
      {children}
    </section>
  )
}

Section.Prose = SectionProse
Section.Reader = SectionReader

export const proseWidth = clsx(
  "min-w-full md:min-w-[64ch] max-w-[64ch] mx-auto px-4",
)

function SectionProse({ className, ...props }: BaseProps): JSX.Element {
  return <Section {...props} className={clsx(proseWidth, className)} />
}

export const proseReaderClassName = clsx(
  "prose prose-invert prose-blockquote:-ml-4",
)

function SectionReader({
  children,
  toc = [],
  id,
  className,
}: {
  id?: string
  children?: ReactNode
  className?: string
  toc?: TocItem[]
}): JSX.Element | null {
  if (!children) return null

  const arrangedToc = toc.reduce(arrangeTocByLevels, [])
  const tocHighestLevel = arrangedToc[0]?.level || 1

  return (
    <Section
      id={id}
      className={clsx(
        "relative rounded mx-auto md:w-max",
        "md:!grid lg:grid-cols-[200px_auto] xl:grid-cols-[200px_1fr_200px]",
      )}
    >
      <aside className={clsx("text-sm")}>
        {toc ? (
          <section className="sticky top-20 overflow-visible hidden lg:block">
            <TocInline
              toc={toc.reduce(arrangeTocByLevels, [])}
              highestLevel={tocHighestLevel}
            />
          </section>
        ) : null}

        <TocFloating
          toc={toc}
          highestLevel={tocHighestLevel}
          className="lg:hidden"
        />
      </aside>

      <main className={clsx(className, "px-4 sm:mx-auto")}>{children}</main>
    </Section>
  )
}
