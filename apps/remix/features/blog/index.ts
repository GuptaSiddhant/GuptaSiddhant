import { type TeaserProps } from "@features/teaser"
import { type Gallery, type LinkObject } from "@features/types"

export interface BlogPostProps extends TeaserProps {
  association?: string
  content?: string
  links?: LinkObject[]
  gallery?: Gallery
}
