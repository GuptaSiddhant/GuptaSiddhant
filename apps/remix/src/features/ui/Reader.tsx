import clsx from "clsx";

import { proseReaderClassName } from "./Section";

export interface ReaderProps {
  id?: string;
  children?: React.ReactNode;
  className?: string;

  leftColumn?: React.ReactNode;
  rightColumn?: React.ReactNode;
}

const asideClassName = clsx("top-20 max-h-screen-main overflow-auto md:sticky");

export default function Reader({
  children,
  id,
  className = proseReaderClassName,
  leftColumn,
  rightColumn,
}: ReaderProps): JSX.Element | null {
  if (!children) {
    return null;
  }

  return (
    <section
      id={id}
      className={clsx(
        "relative mx-auto w-full max-w-full md:max-w-[1500px]",
        "grid grid-cols-1 gap-0 xl:grid-cols-[15rem_1fr_15rem]",
        (leftColumn || rightColumn) && "md:grid-cols-[max-content_1fr]",
      )}
    >
      <aside className={clsx("z-[10] text-sm")}>
        <div className={asideClassName}>{leftColumn}</div>
      </aside>

      <main className={clsx(className, "w-full px-4 sm:mx-auto")}>
        {children}
      </main>

      <aside className={clsx("z-[10] text-sm md:col-span-2 xl:col-span-1")}>
        <div className={asideClassName}>{rightColumn}</div>
      </aside>
    </section>
  );
}
