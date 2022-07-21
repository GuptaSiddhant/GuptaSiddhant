import invariant from "tiny-invariant"

import { useMatches } from "@remix-run/react"
import type { MetaDescriptor } from "@remix-run/server-runtime"

import type { AdminAppProps } from "."

export function createAdminMeta(title?: string): MetaDescriptor {
  const adminTitle = "GS Admin"

  if (!title) return { title: adminTitle }

  return { title: `${title} | ${adminTitle}` }
}

export function useAdminApp(): AdminAppProps {
  const matches = useMatches()
  const adminApp = matches.find(({ handle }) => handle && "adminApp" in handle)
    ?.handle?.adminApp
  invariant(adminApp, "No admin app found. Please add one to the admin route.")

  return adminApp
}
