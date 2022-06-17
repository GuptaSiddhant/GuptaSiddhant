import { type TeaserProps } from "~/packages/teaser"
import { type Gallery, type LinkObject } from "~/packages/types"

export interface BlogPostProps extends TeaserProps {
  association?: string
  content?: string
  links?: LinkObject[]
  gallery?: Gallery
}
