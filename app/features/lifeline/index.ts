import type { ReactNode } from "react"

import type { CareerProps, EducationProps } from "../about"

export interface LifelineDividerProps {
  id: string
  type: "year"
  children: ReactNode
}

export type LifeLineItems = Array<
  LifelineDividerProps | EducationProps | CareerProps
>
