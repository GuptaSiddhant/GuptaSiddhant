import clsx from "clsx";

import { isRouteErrorResponse } from "@remix-run/react";
import type { ErrorResponse } from "@remix-run/router";

import Logo from "@gs/root/Logo";
import Hero from "@gs/ui/Hero";

import CodeBlock from "./CodeBlock";

export interface ErrorSectionProps {
  message?: string;
  title?: string;
  children?: React.ReactNode;
  caption?: string;
  className?: string;
  error?: unknown;
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

export function ErrorSection({
  children,
  className,
  error,
  ...props
}: ErrorSectionProps): JSX.Element | null {
  const errorTexts = getRouteErrorTexts(error);
  const title = props.title || errorTexts.title;
  const caption = props.caption || errorTexts.caption;
  const message = props.message || errorTexts.message;
  const data = errorTexts.data;

  return (
    <Hero className={className}>
      <Hero.Header caption={{ label: caption, icon: "error" }} title={title} />
      <Hero.Description description={message}>
        {children}

        <button
          type="button"
          className="w-max"
          onClick={() => typeof window !== "undefined" && window.history.go(-1)}
        >
          {"< Go back."}
        </button>

        {__IS_DEV__ && data ? (
          <CodeBlock lang="bash">{data.toString()}</CodeBlock>
        ) : null}
      </Hero.Description>
    </Hero>
  );
}

function getRouteErrorTexts(error: unknown): {
  title: string;
  caption: string;
  message?: string;
  data: unknown;
} {
  const defaultResult = {
    title: "Something went wrong.",
    caption: "Error",
    message: undefined,
    data: undefined,
  };

  if (!error) return defaultResult;

  if (isRouteErrorResponse(error)) {
    return {
      title: getErrorResponseTitle(error),
      caption: `Error ${error.status.toString()}`,
      message: undefined,
      data: error.data,
    };
  }

  if (error instanceof Error) {
    return {
      title: error.name,
      caption: "Error",
      message: error.message,
      data: error.stack,
    };
  }

  return defaultResult;
}

export function getErrorResponseTitle(error: ErrorResponse): string {
  const { status, statusText, data } = error;

  const defaultMessages = {
    400: "Oops! There is something wrong with what you requested.",
    401: "Oops! Looks like you tried to visit a page that you do not have access to.",
    402: "Oops! Looks like you need to pay the piper to access this page.",
    403: "Oops! Looks like you tried to visit a page that you do not have access to.",
    404: "Oops! Looks like you tried to visit a page that does not exist.",
    405: "Oops! Looks like you tried to use an unsupported METHOD.",
    500: "Oops! This one is on us. We are working on fixing it.",
  } satisfies Record<number, string>;

  return (
    statusText ||
    defaultMessages[status as keyof typeof defaultMessages] ||
    String(data)
  );
}
