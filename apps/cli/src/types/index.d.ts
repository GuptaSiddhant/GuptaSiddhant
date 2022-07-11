import type { AboutInfo, Skills } from "../../../remix/features/about"
import type { ExperienceProps } from "../../../remix/features/experiences/types"
import type { TeaserProps } from "../../../remix/features/teaser"
import { type ItemProps } from "../components/Select"
import type { UseQueryReturn } from "../helpers/useQuery"

export { AboutInfo, ExperienceProps, Skills, TeaserProps }

export interface PageProps<T> {
  queryFn: () => UseQueryReturn<T[]>
  limit?: number
  Item: (props: PageItemProps<T>) => JSX.Element
}

export type PartialPageProps<T> = Partial<PageProps<T>>

export type PageItemProps<T> = ItemProps<T>

export interface CareerType extends Common, DateTime, Location {
  position: string
  company: string
  type: string
}

export interface EducationType extends Common, DateTime, Location {
  degree: string
  field: string
  school: string
}

export interface ProjectType extends Common, DateTime {
  title: string
  association: string
}

export interface BlogType extends Common {
  title: string
  date: string
  content: string
}

export interface Common {
  slug: { current: string }
  tags: string[]
  link?: string
}

export interface DateTime {
  startDate: string
  endDate?: string
  isCurrent: boolean
}

export interface Location {
  city: string
  country: string
}
