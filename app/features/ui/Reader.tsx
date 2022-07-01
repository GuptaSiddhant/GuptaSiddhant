import clsx from "clsx"

import { proseReaderClassName } from "./Section"

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
    <section
      id={id}
      className={clsx(
        "relative mx-auto w-full max-w-full md:max-w-[1500px]",
        "sm:grid-col-1 grid gap-0 xl:grid-cols-[15rem_1fr_15rem]",
        (leftColumn || rightColumn) && "md:grid-cols-[max-content_1fr]",
      )}
    >
      <aside className={clsx("z-[10] text-sm")}>
        <div className="top-20 overflow-visible md:sticky">{leftColumn}</div>
      </aside>

      <main className={clsx(className, "px-4 sm:mx-auto")}>{children}</main>

      <aside className={clsx("z-[10] text-sm md:col-span-2 xl:col-span-1")}>
        <div className="top-20 overflow-visible md:sticky">{rightColumn}</div>
      </aside>
    </section>
  )
}
