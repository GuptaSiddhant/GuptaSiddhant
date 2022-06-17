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
      className={clsx(className, "relative w-full rounded-md")}
    >
      <summary
        className={clsx(
          summaryClassName,
          "py-2 px-4 mb-1 bg-default rounded-md",
          "font-bold text-sm select-none cursor-pointer",
        )}
      >
        <div className="inline-block pl-1 w-[calc(100%_-_1rem)]">{summary}</div>
      </summary>
      {children}
    </details>
  )
}
