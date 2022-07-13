import { type TeaserProps } from "@gs/teaser"
import { type Gallery, type LinkObject } from "@gs/types"

export interface ProjectProps extends TeaserProps {
  association?: string
  dateEnd?: string
  dateStart: string
  content?: string
  links?: LinkObject[]
  gallery?: Gallery
}
