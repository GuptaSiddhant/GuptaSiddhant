import clsx from "clsx";

import { useCatch } from "@remix-run/react";

import Logo from "@gs/root/Logo";
import Hero from "@gs/ui/Hero";

import CodeBlock from "./CodeBlock";

export interface ErrorSectionProps {
  message?: string;
  title?: string;
  children?: React.ReactNode;
  caption?: string;
  className?: string;
  error?: Error;
}

export function ErrorSection({
  caption = "Error",
  title = "Something went wrong!",
  message,
  children,
  className,
  error,
}: ErrorSectionProps): JSX.Element | null {
  const description = message || error?.message;

  return (
    <Hero className={className}>
      <Hero.Header caption={{ label: caption, icon: "error" }} title={title} />
      <Hero.Description description={description}>
        {children}

        <button
          type="button"
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
  );
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
  );
}

// CatchBoundarySection

export function CatchBoundarySection({
  messages,
}: {
  messages?: Partial<Record<401 | 404, string>>;
}): JSX.Element | null {
  const caught = useCatch();
  const message = useCatchBoundaryMessage(messages);

  const title = `${caught.status}: ${caught.statusText}`;

  return (
    <ErrorSection
      title={title}
      message={message}
      caption={caught.status.toString()}
    />
  );
}

export function useCatchBoundaryMessage(
  messages?: Partial<Record<401 | 404, string>>,
) {
  const { data, status, statusText } = useCatch();

  const defaultMessages: Record<401 | 404, string> = {
    401: "Oops! Looks like you tried to visit a page that you do not have access to.",
    404: "Oops! Looks like you tried to visit a page that does not exist.",
  };

  switch (status) {
    case 401:
    case 404:
      return messages?.[status] || defaultMessages[status];

    default:
      throw new Error(data || statusText);
  }
}
