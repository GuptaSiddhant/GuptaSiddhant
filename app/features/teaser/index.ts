export interface TeaserProps {
  id: string
  title: string
  subtitle?: string
  description?: string
  cover?: string
  icon?: string
  draft?: boolean
  featured?: boolean
  date?: string
  tags?: string[]
}

export enum SortByOption {
  Latest = "latest",
  Oldest = "oldest",
  Featured = "featured",
}

export enum ViewAsOption {
  Grid = "grid",
  List = "list",
}
