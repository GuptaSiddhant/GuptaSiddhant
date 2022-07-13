import type { To } from "@gs/types"

export interface NavigationLinkProps {
  id: string
  children: React.ReactNode
  to?: To
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  download?: string
}
