import type { Style } from "@react-pdf/types/style"

export { Style }

export interface ContactLinkProps {
  key: string
  value: string
  linkUrl?: string
  style?: Style
}

export interface BasePdfProps {
  id?: string
  children: React.ReactNode
  style?: Style
}
