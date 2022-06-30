import clsx from "clsx"

import Section, { proseReaderClassName } from "./Section"

export interface ReaderProps {
  id?: string
  children?: React.ReactNode
  className?: string

  leftColumn?: React.ReactNode
  rightColumn?: React.ReactNode
}

export default function Reader({
  children,

  id,
  className = proseReaderClassName,
  leftColumn,
  rightColumn,
}: ReaderProps): JSX.Element | null {
  if (!children) return null

  return (
    <Section
      id={id}
      className={clsx(
        "relative mx-auto rounded md:w-max",
        "md:!grid md:grid-cols-[1fr_auto] xl:grid-cols-[1fr_auto_1fr]",
      )}
      style={{ gridTemplateAreas: '"left main right"' }}
    >
      {leftColumn ? (
        <aside className={clsx("text-sm")} style={{ gridArea: "left" }}>
          <div className="sticky top-20 overflow-visible">{leftColumn}</div>
        </aside>
      ) : null}

      <main
        className={clsx(className, "px-4 sm:mx-auto")}
        style={{ gridArea: "main" }}
      >
        {children}
      </main>

      {rightColumn ? (
        <aside className={clsx("text-sm")} style={{ gridArea: "right" }}>
          <div className="sticky top-20 overflow-visible">{rightColumn}</div>
        </aside>
      ) : null}
    </Section>
  )
}
