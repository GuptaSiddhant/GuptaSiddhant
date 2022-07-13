import { Caption } from "@features/ui/Text"
import { Link } from "@remix-run/react"
import clsx from "clsx"

export interface LifelineDividerProps {
  id: string
  type: "year"
  children: React.ReactNode
}

export default function LifelineDivider({
  id,
  type,
  children,
}: LifelineDividerProps): JSX.Element | null {
  if (type === "year") {
    const linkId = id

    return (
      <Link
        to={{ hash: linkId }}
        id={linkId}
        className="scroll-mt-20 no-underline"
      >
        <Caption className="relative">
          {children}
          <div
            role="presentation"
            className={clsx(
              "absolute -left-6 top-2 h-4 w-4 rounded-full bg-inverse",
            )}
          />
        </Caption>
      </Link>
    )
  }

  return null
}
