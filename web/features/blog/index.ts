import { type TeaserProps } from "@gs/teaser"
import { type Gallery, type LinkObject } from "@gs/types"

export interface BlogPostProps extends TeaserProps {
  association?: string
  content?: string
  links?: LinkObject[]
  gallery?: Gallery
}
