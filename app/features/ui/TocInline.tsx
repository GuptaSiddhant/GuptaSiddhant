import { Link } from "@remix-run/react"
import clsx from "clsx"

import type { TocItem } from "~/features/helpers/table-of-contents"

export interface TocInlineProps extends TocListItemOptions {
  toc: TocItem[]
}

export default function TocInline({
  toc,
  ...options
}: TocInlineProps): JSX.Element {
  return (
    <nav className={"list-none"}>
      {toc.map((item) => (
        <TocListItem key={item.id} tocItem={item} {...options} />
      ))}
    </nav>
  )
}

interface TocListItemOptions {
  highestLevel: number
  activeId?: string
}

interface TocListItemProps extends TocListItemOptions {
  tocItem: TocItem
}

function TocListItem(props: TocListItemProps): JSX.Element | null {
  const { id, children, level } = props.tocItem

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
  )
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
      <TocInline toc={children} {...options} />
    </details>
  )
}

function TocListLeafItem({ tocItem, ...options }: TocListItemProps) {
  return (
    <span
      className={clsx(
        "before:absolute before:content-['•'] before:-indent-4 text-tertiary",
      )}
    >
      <TocItemLink {...tocItem} activeId={options.activeId} />
    </span>
  )
}

function TocItemLink({
  id,
  activeId,
  text,
}: {
  id: string
  activeId?: string
  text: string
}): JSX.Element | null {
  const isActive = activeId === id

  return (
    <Link
      replace
      to={"#" + id}
      className={clsx(
        isActive ? "font-bold text-primary" : "text-tertiary",
        "hover:text-default",
      )}
    >
      {text}
    </Link>
  )
}
