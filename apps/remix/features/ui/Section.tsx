import clsx from "clsx"

import type { BaseProps } from "@features/types"

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
        "w-full scroll-mt-header-height py-[5vh] md:py-[10vh]",
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

export const proseWidth = clsx(
  "min-w-full md:min-w-[65ch] max-w-[65ch] mx-auto px-4",
)

function SectionProse({ className, ...props }: BaseProps): JSX.Element {
  return <Section {...props} className={clsx(proseWidth, className)} />
}

export const proseReaderClassName = clsx(
  "prose prose-blockquote:-ml-4 dark:prose-invert small-only:!max-w-full",
)
