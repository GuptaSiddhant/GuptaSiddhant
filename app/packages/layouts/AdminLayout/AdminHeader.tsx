import { NavLink } from "@remix-run/react"
import { type ReactNode } from "react"

import type { NavigationLinkProps } from "~/packages/components/Link"

export default function AdminHeader({
  children,
  actions,
}: {
  children: ReactNode
  actions?: NavigationLinkProps[]
}): JSX.Element {
  return (
    <header className="sticky top-0 px-4 min-h-[3rem] grid items-center grid-cols-[1fr_max-content] border-b border-divider">
      <div className="text-ellipsis whitespace-nowrap overflow-hidden flex gap-4 items-center">
        {children}
      </div>
      <div className="flex items-center gap-4">
        {actions?.map((props) => (
          <AdminAction key={props.id} {...props} />
        ))}
      </div>
    </header>
  )
}

function AdminAction({
  id,
  to,
  children,
  ...props
}: NavigationLinkProps): JSX.Element | null {
  if (props.onClick) {
    return (
      <button
        title={id}
        className="hocus:text-primary hocus:underline underline-offset-8"
        {...props}
      >
        {children}
      </button>
    )
  }

  if (to) {
    return (
      <NavLink to={to} title={id} {...props}>
        {children}
      </NavLink>
    )
  }

  return <>{children}</>
}
