import clsx from "clsx"

import Hero from "~/features/hero"
import Logo from "~/features/root/Logo"

import CodeBlock from "./CodeBlock"

export interface ErrorSectionProps {
  message?: string
  title?: string
  children?: React.ReactNode
  caption?: string
  className?: string
  error?: Error
}

export function ErrorSection({
  caption = "Error",
  title = "Something went wrong!",
  message,
  children,
  className,
  error,
}: ErrorSectionProps): JSX.Element | null {
  const description = message || error?.message

  return (
    <Hero className={className}>
      <Hero.Header caption={{ label: caption, icon: "error" }} title={title} />
      <Hero.Description description={description}>
        {children}

        <button
          className="w-max"
          onClick={() => typeof window !== "undefined" && window.history.go(-1)}
        >
          {"< Go back."}
        </button>

        {__IS_DEV__ && error?.stack ? (
          <CodeBlock lang="bash">{error.stack}</CodeBlock>
        ) : null}
      </Hero.Description>
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
        "mx-auto mt-[10vh] rounded-xl px-16",
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
