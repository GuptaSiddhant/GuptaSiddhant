import clsx from "clsx"

export interface AccordionProps {
  open?: boolean | "always"
  summary?: React.ReactNode
  children: React.ReactNode
  className?: string
  summaryClassName?: string
  summaryLeadingElement?: React.ReactNode
  accordionRef?: React.Ref<HTMLDetailsElement>
  summaryRef?: React.Ref<HTMLElement>
}

export default function Accordion({
  children,
  summary,
  open,
  className,
  summaryClassName,
  summaryLeadingElement,
  accordionRef,
  summaryRef,
}: AccordionProps): JSX.Element | null {
  const alwaysOpen = open === "always"
  const TagName: keyof JSX.IntrinsicElements = alwaysOpen ? "div" : "details"

  return (
    <TagName
      open={Boolean(open)}
      className={clsx(
        className,
        "relative w-full rounded-md",
        "transition-[height]",
      )}
      ref={accordionRef as React.Ref<any>}
    >
      {summary && (
        <AccordionSummary
          summaryRef={summaryRef}
          className={summaryClassName}
          alwaysOpen={alwaysOpen}
          leadingElement={summaryLeadingElement}
        >
          {summary}
        </AccordionSummary>
      )}
      {children}
    </TagName>
  )
}

Accordion.Summary = AccordionSummary

export interface AccordionSummaryProps {
  children: React.ReactNode
  className?: string
  leadingElement?: React.ReactNode
  alwaysOpen?: boolean
  summaryRef?: React.Ref<HTMLElement>
}

function AccordionSummary({
  children,
  className,
  leadingElement,
  alwaysOpen,
  summaryRef,
}: AccordionSummaryProps): JSX.Element | null {
  const TagName: keyof JSX.IntrinsicElements = alwaysOpen ? "div" : "summary"

  return (
    <TagName
      ref={summaryRef as React.Ref<any>}
      className={clsx(
        className,
        "mb-1 rounded-md bg-default py-2 px-4 text-sm font-bold",
        !alwaysOpen && "cursor-pointer select-none ",
      )}
    >
      <div
        className={clsx(
          "inline-flex items-center gap-2",
          leadingElement ? "justify-between" : "justify-start",
          alwaysOpen ? "w-full" : "w-[calc(100%_-_1rem)] pl-1",
        )}
      >
        <div className="flex-1">{children}</div>
        {leadingElement ? (
          <div className="flex items-center justify-end gap-2">
            {leadingElement}
          </div>
        ) : null}
      </div>
    </TagName>
  )
}
