import clsx from "clsx"
import { type ReactNode } from "react"

import { proseWidth } from "~/features/ui/Section"
import { Paragraph } from "~/features/ui/Text"

export interface HeroDescriptionProps {
  description?: string
  children?: ReactNode
}

export default function HeroDescription({
  description,
  children,
}: HeroDescriptionProps): JSX.Element | null {
  return (
    <div className={clsx(proseWidth, "flex flex-col gap-4")}>
      {description ? <Paragraph>{description}</Paragraph> : null}
      {children}
    </div>
  )
}
