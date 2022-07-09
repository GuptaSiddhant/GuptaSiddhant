import clsx from "clsx"
import type { ReactNode } from "react"

export interface AccordionProps {
  open?: boolean
  summary: ReactNode
  children: ReactNode
  className?: string
  summaryClassName?: string
}

export default function Accordion({
  children,
  summary,
  open,
  className,
  summaryClassName,
}: AccordionProps): JSX.Element | null {
  return (
    <details
      open={open}
      className={clsx(
        className,
        "relative w-full rounded-md",
        "transition-[height]",
      )}
    >
      <summary
        className={clsx(
          summaryClassName,
          "mb-1 rounded-md bg-default py-2 px-4",
          "cursor-pointer select-none text-sm font-bold",
        )}
      >
        <div className="inline-block w-[calc(100%_-_1rem)] pl-1">{summary}</div>
      </summary>
      {children}
    </details>
  )
}
