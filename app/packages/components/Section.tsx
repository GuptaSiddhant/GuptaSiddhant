import type { BaseProps } from "~/packages/types"
import clsx from "clsx"
import Logo from "./Logo"
import { Caption, H1, Paragraph } from "./Text"

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
      className={clsx(
        "relative ",
        "w-full py-[10vh]",
        "flex flex-col gap-12",
        className,
      )}
      ref={elementRef}
    >
      {children}
    </section>
  )
}

Section.Hero = SectionHero
Section.Prose = SectionProse
Section.Error = SectionError

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

function SectionError({
  children,
  className,
  caption,
  title,
  description,
  logo,
  ...props
}: BaseProps & {
  logo?: boolean
  caption: string
  title: string
  description?: string
}) {
  return (
    <SectionProse
      {...props}
      className={clsx(
        className,
        "mx-auto rounded-xl px-16 mt-[10vh]",
        "bg-primary text-lg",
      )}
    >
      {logo ? (
        <div className="absolute -top-4">
          <Logo />
        </div>
      ) : null}
      <Caption>{caption}</Caption>
      <H1 className="text-error">{title}</H1>
      {description && (
        <Paragraph className="text-tertiary">{description}</Paragraph>
      )}
      {children}
      <button
        className="w-max"
        onClick={() => typeof window !== "undefined" && window.history.go(-1)}
      >
        {"< Go back."}
      </button>
    </SectionProse>
  )
}
