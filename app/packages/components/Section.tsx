import clsx from "clsx"

import type { BaseProps } from "~/packages/types"

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

export const proseWidth = clsx("md:min-w-[64ch] max-w-[64ch] mx-auto px-4")

function SectionProse({ className, ...props }: BaseProps): JSX.Element {
  return <Section {...props} className={clsx(proseWidth, className)} />
}
