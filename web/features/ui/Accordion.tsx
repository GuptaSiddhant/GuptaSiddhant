import clsx from "clsx"
import type { ReactNode } from "react"

export interface AccordionProps {
  open?: boolean
  summary: ReactNode
  children: ReactNode
  className?: string
  summaryClassName?: string
  summaryLeadingElement?: ReactNode
  accordionRef?: React.Ref<HTMLDetailsElement>
}

export default function Accordion({
  children,
  summary,
  open,
  className,
  summaryClassName,
  summaryLeadingElement,
  accordionRef,
}: AccordionProps): JSX.Element | null {
  return (
    <details
      open={open}
      className={clsx(
        className,
        "relative w-full rounded-md",
        "transition-[height]",
      )}
      ref={accordionRef}
    >
      <summary
        className={clsx(
          summaryClassName,
          "mb-1 rounded-md bg-default py-2 px-4",
          "cursor-pointer select-none text-sm font-bold",
        )}
      >
        <div
          className={clsx(
            "inline-block w-[calc(100%_-_1rem)] pl-1",
            "inline-flex items-center gap-2",
            summaryLeadingElement ? "justify-between" : "justify-start",
          )}
        >
          <div className="flex-1">{summary}</div>
          {summaryLeadingElement ? (
            <div className="flex items-center justify-end gap-2">
              {summaryLeadingElement}
            </div>
          ) : null}
        </div>
      </summary>
      {children}
    </details>
  )
}
