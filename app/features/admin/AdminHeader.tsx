import { NavLink } from "@remix-run/react"
import { type ReactNode } from "react"

import type { NavigationLinkProps } from "~/features/ui/Link"

export default function AdminHeader({
  children,
  actions,
  collapsed,
  icon,
}: {
  children: ReactNode
  actions?: NavigationLinkProps[]
  collapsed?: boolean
  icon: ReactNode
}): JSX.Element {
  if (collapsed)
    return (
      <header className="w-full flex flex-col gap-4">
        <div
          title={children?.toString() || "App"}
          className="w-full h-12 flex-center border-b border-divider bg-secondary"
        >
          {icon}
        </div>
        <div
          id="admin-app-actions"
          className="flex flex-col items-center gap-4"
        >
          {actions?.map((props) => (
            <AdminAction key={props.id} {...props} />
          ))}
        </div>
      </header>
    )

  return (
    <header className="sticky top-0 px-4 min-h-[3rem] grid items-center grid-cols-[1fr_max-content] gap-2 border-b border-divider bg-secondary">
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
