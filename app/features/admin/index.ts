import type { MetaDescriptor } from "@remix-run/server-runtime"
import type { ReactNode } from "react"

import type { To } from "~/features/types"

export interface AdminAppProps {
  id: string
  name: string
  icon: ReactNode
  to: To
}

export function createAdminMeta(title?: string): MetaDescriptor {
  const adminTitle = "GS Admin"

  if (!title) return { title: adminTitle }

  return { title: `${title} | ${adminTitle}` }
}
