import { type SummaryItem } from "@gs/summary"
import { type Gallery, type LinkObject } from "@gs/types"

export interface BlogPostProps extends SummaryItem {
  association?: string
  content?: string
  links?: LinkObject[]
  gallery?: Gallery
}
