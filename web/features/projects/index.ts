import { type SummaryItem } from "@gs/summary"
import { type Gallery, type LinkObject } from "@gs/types"

export interface ProjectProps extends SummaryItem {
  association?: string
  dateEnd?: string
  dateStart: string
  content?: string
  links?: LinkObject[]
  gallery?: Gallery
}
