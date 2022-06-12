import { Link } from "@remix-run/react"
import clsx from "clsx"

import { type TocItem } from "./helpers"

export interface TableOfContentsProps {
  toc: TocItem[]
  highestLevel: number
  activeId?: string
}

export default function InlineTOC({
  toc,
  ...options
}: TableOfContentsProps): JSX.Element {
  const { activeId, highestLevel } = options

  return (
    <nav className={"list-none"}>
      {toc.map((item) => {
        const isActive = activeId === item.id
        const itemContent = (
          <Link
            replace
            to={"#" + item.id}
            className={clsx(
              isActive ? "font-bold text-primary" : "text-tertiary",
              "hover:text-default",
            )}
          >
            {item.text}
          </Link>
        )

        return (
          <li
            key={item.id}
            className={clsx(
              "relative my-2",
              item.level > highestLevel && "ml-4",
            )}
          >
            {item.children.length === 0 ? (
              <span
                className={clsx(
                  "before:absolute before:content-['•'] before:-indent-4 text-tertiary",
                )}
              >
                {itemContent}
              </span>
            ) : (
              <details key={item.id} open>
                <summary className="-indent-4">{itemContent}</summary>
                <InlineTOC toc={item.children} {...options} />
              </details>
            )}
          </li>
        )
      })}
    </nav>
  )
}
