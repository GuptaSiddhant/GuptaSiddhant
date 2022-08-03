import { createContext, useContext } from "react"
import invariant from "@gs/utils/invariant"

import { type ThemeName } from "@gs/theme"

interface RootContextValue {
  locale: string
  themeName: ThemeName
}

export const RootContext = createContext<RootContextValue | undefined>(
  undefined,
)

export default function useRootContext(): RootContextValue {
  const context = useContext(RootContext)
  invariant(context, "useRootContext must be used within a RootContext")

  return context
}
