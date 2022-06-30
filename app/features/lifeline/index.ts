import type { CareerProps, EducationProps } from "~/features/about"

import { type LifelineDividerProps } from "./LifelineDivider"

export type LifeLineItem = LifelineDividerProps | EducationProps | CareerProps

export type LifeLineItems = Array<LifeLineItem>
