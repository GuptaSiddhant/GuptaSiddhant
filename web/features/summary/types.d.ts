import { type DatabaseModel } from "@gs/service/database.server"
import { type LinkObject } from "@gs/types"

export interface SummaryItem {
  id: string
  title: string
  model: DatabaseModel

  subtitle?: string
  description?: string
  date?: string
  icon?: string
  cover?: string
  tags?: string[]
  links?: LinkObject[]
  linkUrl?: string
  duration?: string

  draft?: boolean
  featured?: boolean
}

export interface SummaryTimelineDivider {
  id: string
  type: "year"
  children: React.ReactNode
}
