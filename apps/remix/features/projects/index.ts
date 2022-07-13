import { type TeaserProps } from "@features/teaser"
import { type Gallery, type LinkObject } from "@features/types"

export interface ProjectProps extends TeaserProps {
  association?: string
  dateEnd?: string
  dateStart: string
  content?: string
  links?: LinkObject[]
  gallery?: Gallery
}
