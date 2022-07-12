export interface AdminAppProps {
  id: string
  name: string
  icon: JSX.Element | null
  to: string
}

export interface AdminAppHandle {
  adminApp: AdminAppProps
}
