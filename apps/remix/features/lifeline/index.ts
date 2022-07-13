import type { ExperienceProps } from "@features/experiences/types"

import { type LifelineDividerProps } from "./LifelineDivider"

export type LifeLineItem = LifelineDividerProps | ExperienceProps

export type LifeLineItems = Array<LifeLineItem>

export enum LifeLineCategory {
  All = "",
  Education = "education",
  Career = "career",
}
