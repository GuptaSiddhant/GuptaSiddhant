import { Link, useLocation } from "@remix-run/react";
import clsx from "clsx";

import type { TableOfContentProps, TocListItemProps } from "./types";

export default function InlineTableOfContent({
  toc,
  className,
  ...options
}: TableOfContentProps): JSX.Element {
  return (
    <nav className={clsx(className, "list-none")}>
      {toc.map((item) => (
        <TocListItem key={item.id} tocItem={item} {...options} />
      ))}
    </nav>
  );
}

function TocListItem(props: TocListItemProps): JSX.Element | null {
  const { id, children, level } = props.tocItem;

  return (
    <li
      key={id}
      className={clsx("relative my-2", level > props.highestLevel && "ml-4")}
    >
      {children.length === 0 ? (
        <TocListLeafItem key={id} {...props} />
      ) : (
        <TocListAccordion key={id} {...props} />
      )}
    </li>
  );
}

function TocListAccordion({
  tocItem: { id, children, text },
  ...options
}: TocListItemProps): JSX.Element | null {
  return (
    <details open>
      <summary className="-indent-4">
        <TocItemLink id={id} activeId={options.activeId} text={text} />
      </summary>
      <InlineTableOfContent toc={children} {...options} />
    </details>
  );
}

function TocListLeafItem({ tocItem, ...options }: TocListItemProps) {
  return (
    <span
      className={clsx(
        "text-tertiary before:absolute before:-indent-4 before:content-['•']",
      )}
    >
      <TocItemLink {...tocItem} activeId={options.activeId} />
    </span>
  );
}

function TocItemLink({
  id,
  activeId,
  text,
}: {
  id: string;
  activeId?: string;
  text: string;
}): JSX.Element | null {
  const { search } = useLocation();
  const isActive = activeId?.toLowerCase() === id.toLowerCase();

  return (
    <Link
      replace
      to={{ hash: id, search }}
      className={clsx(
        isActive ? "font-bold text-primary" : "text-tertiary",
        "hover:text-default",
      )}
    >
      {text}
    </Link>
  );
}
