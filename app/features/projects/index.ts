import { type TeaserProps } from "~/packages/teaser"
import { type Gallery, type LinkObject } from "~/packages/types"

export interface ProjectProps extends TeaserProps {
  association?: string
  dateEnd?: string
  dateStart: string
  content?: string
  links?: LinkObject[]
  gallery?: Gallery
}
