import clsx from "clsx"

import Hero from "./Hero"
import Logo from "./Logo"
import { Paragraph } from "./Text"

export interface ErrorSectionProps {
  message?: string
  title?: string
  children?: React.ReactNode
  caption?: string
  className?: string
}

export function ErrorSection({
  caption = "Error",
  title = "Something went wrong!",
  message,
  children,
  className,
}: ErrorSectionProps): JSX.Element | null {
  return (
    <Hero className={className}>
      <Hero.Header caption={{ label: caption, icon: "error" }} title={title} />
      <Paragraph className="text-tertiary">{message}</Paragraph>
      {children}
      <button
        className="w-max"
        onClick={() => typeof window !== "undefined" && window.history.go(-1)}
      >
        {"< Go back."}
      </button>
    </Hero>
  )
}

export function ErrorPage({
  children,
  ...props
}: ErrorSectionProps): JSX.Element | null {
  return (
    <ErrorSection
      {...props}
      className={clsx(
        "mx-auto rounded-xl px-16 mt-[10vh]",
        "bg-primary text-lg",
      )}
    >
      <div className="absolute -top-4">
        <Logo />
      </div>

      {children}
    </ErrorSection>
  )
}
