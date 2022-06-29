import type { ReactNode } from "react"

import type { CareerProps, EducationProps } from "~/features/aboutt"

export interface LifelineDividerProps {
  id: string
  type: "year"
  children: ReactNode
}

export type LifeLineItem = LifelineDividerProps | EducationProps | CareerProps

export type LifeLineItems = Array<LifeLineItem>
