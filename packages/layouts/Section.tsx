import clsx from "clsx"

import type { BaseProps } from "@gs/types"

export const proseWidth = clsx("md:min-w-[64ch] max-w-[64ch] mx-auto px-4")

export default function Section({
  children,
  className,
  elementRef,
  ...props
}: BaseProps): JSX.Element {
  return (
    <section
      {...props}
      className={clsx("w-full py-24", "flex flex-col gap-12", className)}
      ref={elementRef}
    >
      {children}
    </section>
  )
}

Section.Hero = SectionHero
Section.Prose = SectionProse

function SectionProse({ className, ...props }: BaseProps): JSX.Element {
  return <Section {...props} className={clsx(proseWidth, className)} />
}

function SectionHero({
  className,
  id = "hero",
  ...props
}: BaseProps): JSX.Element {
  return (
    <SectionProse {...props} id={id} className={clsx(className, "mt-[10vh]")} />
  )
}
