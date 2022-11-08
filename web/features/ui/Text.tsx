import clsx from "clsx";
import {
  type ComponentPropsWithoutRef,
  Children,
  useEffect,
  useState,
} from "react";

import { Link } from "@remix-run/react";

import { generateHeadingId } from "@gs/helpers";
import type { BaseProps } from "@gs/types";

const commonHeadingClassName = clsx("font-bold leading-tight !m-0");

export interface HeadingProps extends BaseProps {
  link?: boolean;
  headingRef?: React.Ref<HTMLHeadingElement>;
}

export function H1(props: HeadingProps) {
  return (
    <HeadingWrapper {...props} headingClassName={clsx("text-6xl")} as="h1" />
  );
}

export function H2({ ...props }: HeadingProps) {
  return (
    <HeadingWrapper
      {...props}
      headingClassName={clsx("text-5xl pt-16 pb-12")}
      as="h2"
    />
  );
}

export function H3(props: HeadingProps) {
  return (
    <HeadingWrapper
      {...props}
      headingClassName={clsx("text-4xl pt-12 pb-8")}
      as="h3"
    />
  );
}

export function H4(props: HeadingProps) {
  return (
    <HeadingWrapper
      {...props}
      headingClassName={clsx("text-3xl pt-8 pb-4")}
      as="h4"
    />
  );
}

export function H5(props: HeadingProps) {
  return (
    <HeadingWrapper
      {...props}
      headingClassName={clsx("text-2xl py-2")}
      as="h5"
    />
  );
}

export function H6(props: HeadingProps) {
  return (
    <HeadingWrapper
      {...props}
      headingClassName={clsx("text-xl py-1")}
      as="h6"
    />
  );
}

export function Caption({ className, ...props }: BaseProps): JSX.Element {
  return (
    <strong
      {...props}
      className={clsx(
        "text-2xl font-black uppercase tracking-widest text-secondary",
        className,
      )}
    />
  );
}

export function SubHeading(props: HeadingProps) {
  return (
    <p
      {...props}
      className={clsx("text-2xl text-tertiary", commonHeadingClassName)}
    />
  );
}

export function Paragraph({
  children,
  ...props
}: ComponentPropsWithoutRef<"p">): JSX.Element {
  const exceptionTypeNames = ["img", "pre", "figure"];

  if (Children.count(children) === 1) {
    // rome-ignore lint(nursery/noExplicitAny): Complex
    const onlyChild: any = Children.toArray(children)[0];
    const typeName: string = onlyChild?.type?.name;

    if (exceptionTypeNames.includes(String(typeName).toLowerCase())) {
      return <>{children}</>;
    }
  }

  return <p {...props}>{children}</p>;
}

function HeadingWrapper({
  id,
  children,
  className,
  as: Component = "h1",
  link = false,
  headingClassName,
  headingRef,
  ...props
}: ComponentPropsWithoutRef<"h1"> & {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  link?: boolean;
  headingClassName?: string;
  headingRef?: React.Ref<HTMLHeadingElement>;
}): JSX.Element | null {
  const uid = id || generateHeadingId(children);

  return (
    <Component
      {...props}
      ref={headingRef}
      id={uid}
      className={clsx(
        headingClassName,
        commonHeadingClassName,
        className,
        link && "scroll-mt-8",
      )}
    >
      {children}
      {link ? (
        <Link to={`#${uid}`} className="invisible">
          {""}
        </Link>
      ) : null}
    </Component>
  );
}

export function ChangingText({
  texts,
  duration = 4000,
}: {
  texts: string[];
  duration?: number;
}): JSX.Element {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % texts.length);
    }, duration);

    return () => {
      clearInterval(interval);
    };
  }, [texts, duration]);

  return (
    <span className="inline-block animate-appear-btt" key={index}>
      {texts[index]}
    </span>
  );
}
