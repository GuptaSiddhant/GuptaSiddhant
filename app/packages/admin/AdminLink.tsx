import { Link, NavLink } from "@remix-run/react"
import clsx from "clsx"
import { type ReactNode } from "react"

export interface AdminLinkProps {
  id: string
  children: ReactNode
  title: string
  onClick?: () => void
  isAction?: boolean
}

export default function AdminLink({
  children,
  id,
  title,
  onClick,
  isAction,
}: AdminLinkProps): JSX.Element | null {
  const style = (props?: { isActive?: boolean; isAction?: boolean }) =>
    clsx(
      props?.isAction ? "p-1 rounded-sm" : "p-2 rounded",
      props?.isActive ? "bg-tertiary" : "bg-secondary hover:bg-tertiary",
    )

  if (onClick) {
    return (
      <button onClick={onClick} className={style({ isAction })} title={title}>
        {children}
      </button>
    )
  }

  if (isAction) {
    return (
      <Link to={id} className={style({ isAction })} title={title}>
        {children}
      </Link>
    )
  }

  return (
    <NavLink to={id} title={title} className={style}>
      {children}
    </NavLink>
  )
}
