import { createContext, useContext } from "react"

export interface AdminContextValue {
  defaultNavbarCollapsed: boolean
}

export const AdminContext = createContext<undefined | AdminContextValue>(
  undefined,
)

export default function useAdminContext() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdminContext must be used within Admin route.")
  }

  return context
}
