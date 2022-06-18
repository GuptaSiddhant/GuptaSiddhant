import clsx from "clsx"
import { type ReactNode, useState } from "react"

import useTimeout from "~/features/hooks/useTimeout"

import useToaster from "."

export interface ToastProps {
  id: string
  title: string
  icon: ReactNode
  dismissed?: boolean
  durationInMs?: number
}

export default function Toast({
  id,
  icon,
  title,
  dismissed,
  durationInMs = 5000,
}: ToastProps): JSX.Element {
  const { dismissToast } = useToaster()
  const [isHovering, setIsHovering] = useState(false)

  useTimeout(() => dismissToast(id), durationInMs, isHovering)

  return (
    <div
      className={clsx(
        "bg-secondary p-4 rounded w-full",
        dismissed ? "animate-disappear-ltr" : "animate-appear-rtl",
        "flex flex-wrap gap-4",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {icon}
      {title}
    </div>
  )
}
